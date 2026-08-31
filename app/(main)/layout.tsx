import { FloatingCheckIn } from "@/components/ui/floating-checkin"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
      <FloatingCheckIn />
    </>
  )
}
