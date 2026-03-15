import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Button } from "./button";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <Card className="rounded-[2rem] text-center">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="mx-auto max-w-xl text-sm leading-7 text-muted-foreground">{description}</p>
        {actionLabel && actionHref ? (
          <Button asChild className="mt-6">
            <Link href={actionHref}>{actionLabel}</Link>
          </Button>
        ) : (
          <Button className="mt-6" disabled variant="secondary">
            Chua co hanh dong
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
