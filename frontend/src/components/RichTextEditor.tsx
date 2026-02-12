import { useRef } from "react";
import JoditEditor from "jodit-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  config: object;
}

export default function RichTextEditor({
  value,
  onChange,
  config,
}: RichTextEditorProps) {
  const editor = useRef(null);

  return (
    <JoditEditor
      ref={editor}
      value={value}
      config={config}
      onBlur={(newContent: string) => onChange(newContent)}
    />
  );
}
