import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/_layout/feed/")({
  component: () => <div>feed</div>
});
