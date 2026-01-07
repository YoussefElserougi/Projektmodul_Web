// app/form/page.tsx
// Redirect zu /chat (Haupt-Route)
// Behalten für Backward-Compatibility mit alten E-Mail-Links

import { redirect } from "next/navigation";

export default function FormPage() {
  redirect("/chat");
}

