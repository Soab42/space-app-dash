import UploadForm from "@/components/UploadForm";
import AuthGuard from "@/components/AuthGuard";

export default function Page() {
  return (
    <AuthGuard>
      <UploadForm />
    </AuthGuard>
  );
}
