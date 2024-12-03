import FileUploader from "../components/FileUploader";

export default function Home() {
  return (
    <main style={{ textAlign: "center", padding: "20px" }}>
      <h1>GPT File Uploader</h1>
      <FileUploader />
    </main>
  );
}
