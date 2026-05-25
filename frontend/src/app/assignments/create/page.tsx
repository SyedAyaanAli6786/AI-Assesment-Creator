'use client';

import React from 'react';
import Header from '../../../components/Header/Header';
import CreateAssignment from '../../../components/CreateAssignment/CreateAssignment';

export default function CreateAssignmentPage() {
  return (
    <>
      <Header title="Assignment" showBack />
      <CreateAssignment />
    </>
  );
}
