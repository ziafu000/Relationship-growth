import { FloatingCheckIn } from "@/components/ui/floating-checkin"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <main id="main-content">{children}</main>
      <FloatingCheckIn />
    </>
  )
}
