"use client";

import { Spinner } from "@heroui/react";

export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center mx-auto h-full">
      <Spinner size="lg" />
    </div>
  );
}
