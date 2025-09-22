import UploadForm from "@/components/UploadForm";

export default function Page() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Upload Publication</h1>
      <UploadForm />
      <p className="text-sm text-gray-400 mt-6">
        Tip: For authors, paste JSON like: {JSON.stringify({name: "Jane Doe", affiliation: "NASA", rank: 1})}
      </p>
    </div>
  );
}
