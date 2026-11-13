"use client";

import { useTasks } from "@/hooks/use-tasks";

// Temporary page that proves the API connection works.
// The real table replaces this in the next step.
export default function Home() {
  const { data: tasks, isPending, error } = useTasks();

  return (
    <main className="mx-auto w-full max-w-5xl p-6">
      <h1 className="text-2xl font-semibold">Tasks</h1>
      {isPending && <p>Loading tasks...</p>}
      {error && <p>{error.message}</p>}
      <ul className="mt-4 list-disc pl-6">
        {tasks?.map((task) => (
          <li key={task.id}>
            {task.title} ({task.status})
          </li>
        ))}
      </ul>
    </main>
  );
}
