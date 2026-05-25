import { Request, Response } from 'express';
import { Assignment } from '../models/Assignment';
import { generationQueue } from '../config/queue';
import { getRedisClient } from '../config/redis';
import { AssignmentInput } from '../types';

export const createAssignment = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      subject,
      className,
      schoolName,
      dueDate,
      questionTypes,
      totalQuestions,
      totalMarks,
      timeAllowed,
      additionalInstructions,
      uploadedContent,
    } = req.body;

    // Validation
    if (!subject || !className || !dueDate || !questionTypes || questionTypes.length === 0) {
      res.status(400).json({ error: 'Missing required fields: subject, className, dueDate, questionTypes' });
      return;
    }

    if (totalQuestions <= 0 || totalMarks <= 0) {
      res.status(400).json({ error: 'Total questions and marks must be positive' });
      return;
    }

    for (const qt of questionTypes) {
      if (!qt.type || qt.numberOfQuestions <= 0 || qt.marksPerQuestion <= 0) {
        res.status(400).json({ error: 'Invalid question type configuration' });
        return;
      }
    }

    // Create the title from subject
    const title = `Quiz on ${subject}`;

    // Create assignment in MongoDB
    const assignment = await Assignment.create({
      title,
      subject,
      className,
      schoolName: schoolName || 'Delhi Public School, Sector-4, Bokaro',
      dueDate: new Date(dueDate),
      questionTypes,
      totalQuestions,
      totalMarks,
      timeAllowed: timeAllowed || '45 minutes',
      additionalInstructions: additionalInstructions || '',
      uploadedContent: uploadedContent || '',
      status: 'draft',
    });

    // Prepare input for AI generation
    const input: AssignmentInput = {
      subject,
      className,
      schoolName: assignment.schoolName,
      dueDate,
      questionTypes,
      totalQuestions,
      totalMarks,
      timeAllowed: assignment.timeAllowed,
      additionalInstructions,
      uploadedContent,
    };

    // Add job to BullMQ queue
    const job = await generationQueue.add('generate', {
      assignmentId: assignment._id.toString(),
      input,
    });

    // Update assignment with job ID
    assignment.jobId = job.id || '';
    assignment.status = 'generating';
    await assignment.save();

    // Store job state in Redis
    try {
      const redis = getRedisClient();
      await redis.setEx(
        `job:${job.id}`,
        3600,
        JSON.stringify({ assignmentId: assignment._id, status: 'queued' })
      );
    } catch (cacheError) {
      console.warn('Redis caching of job state failed:', cacheError);
    }

    res.status(201).json({
      message: 'Assignment created and generation started',
      assignment: {
        id: assignment._id,
        title: assignment.title,
        status: assignment.status,
        jobId: job.id,
      },
    });
  } catch (error: any) {
    console.error('Create assignment error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

export const getAssignments = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, status } = req.query;
    
    const filter: any = {};
    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }
    if (status) {
      filter.status = status;
    }

    const assignments = await Assignment.find(filter)
      .sort({ createdAt: -1 })
      .select('-generatedPaper');

    res.json({ assignments });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

export const getAssignment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Try Redis cache first
    try {
      const redis = getRedisClient();
      const cached = await redis.get(`assignment:${id}`);
      if (cached) {
        const assignment = await Assignment.findById(id).select('-generatedPaper');
        if (assignment) {
          res.json({
            assignment: {
              ...assignment.toObject(),
              generatedPaper: JSON.parse(cached),
            },
          });
          return;
        }
      }
    } catch (cacheError) {
      // Continue without cache
    }

    const assignment = await Assignment.findById(id);
    if (!assignment) {
      res.status(404).json({ error: 'Assignment not found' });
      return;
    }

    res.json({ assignment });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

export const deleteAssignment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const assignment = await Assignment.findByIdAndDelete(id);
    if (!assignment) {
      res.status(404).json({ error: 'Assignment not found' });
      return;
    }

    // Remove from Redis cache
    try {
      const redis = getRedisClient();
      await redis.del(`assignment:${id}`);
    } catch (cacheError) {
      // Continue without cache cleanup
    }

    res.json({ message: 'Assignment deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

export const renameAssignment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    if (!title || title.trim() === '') {
      res.status(400).json({ error: 'Title cannot be empty' });
      return;
    }

    const assignment = await Assignment.findByIdAndUpdate(
      id,
      { title: title.trim() },
      { new: true }
    ).select('-generatedPaper');

    if (!assignment) {
      res.status(404).json({ error: 'Assignment not found' });
      return;
    }

    // Remove from Redis cache so get fetches fresh
    try {
      const redis = getRedisClient();
      await redis.del(`assignment:${id}`);
    } catch (cacheError) {
      // Continue
    }

    res.json({ assignment });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

export const regenerateAssignment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const assignment = await Assignment.findById(id);
    if (!assignment) {
      res.status(404).json({ error: 'Assignment not found' });
      return;
    }

    const input: AssignmentInput = {
      subject: assignment.subject,
      className: assignment.className,
      schoolName: assignment.schoolName,
      dueDate: assignment.dueDate.toISOString(),
      questionTypes: assignment.questionTypes,
      totalQuestions: assignment.totalQuestions,
      totalMarks: assignment.totalMarks,
      timeAllowed: assignment.timeAllowed,
      additionalInstructions: assignment.additionalInstructions,
      uploadedContent: assignment.uploadedContent,
    };

    // Add new job to queue
    const job = await generationQueue.add('generate', {
      assignmentId: id,
      input,
    });

    assignment.jobId = job.id || '';
    assignment.status = 'generating';
    assignment.generatedPaper = null;
    await assignment.save();

    res.json({
      message: 'Regeneration started',
      jobId: job.id,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

export const getJobStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { jobId } = req.params;

    try {
      const redis = getRedisClient();
      const jobState = await redis.get(`job:${jobId}`);
      if (jobState) {
        res.json(JSON.parse(jobState));
        return;
      }
    } catch (cacheError) {
      // Continue
    }

    const job = await generationQueue.getJob(jobId as string);
    if (!job) {
      res.status(404).json({ error: 'Job not found' });
      return;
    }

    const state = await job.getState();
    res.json({ jobId, state, data: job.data });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};
