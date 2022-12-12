import { Link } from "react-router-dom";
import { useGetChangelogsQuery } from "../store/api";
import Markdown from "./markdown";

interface ReleasePreviewProps {
  version: string;
  releaseDate: string;
  content: string;
  downloadUrl: string;
}

function ReleasePreview({
  version,
  releaseDate,
  content,
  downloadUrl,
}: ReleasePreviewProps) {
  return (
    <li className="flex flex-col flex-1 p-4 rounded-md bg-neutral-800">
      <div className="flex items-baseline mb-2">
        <h3 className="text-2xl font-semibold">Arithmico {version}</h3>
        <span className="ml-auto text-white/40 text-sm">
          {new Date(releaseDate).toLocaleDateString("de-DE")}
        </span>
      </div>

      <div className="">
        <div className="w-full h-40 max-h-40 overflow-hidden">
          <Markdown content={content} />
        </div>
        <div className="-translate-y-[100%] w-full h-4 bg-gradient-to-b from-transparent to-neutral-800"></div>
      </div>

      <Link className="mb-4 text-white/50 text-sm" to="/releases/123">
        {">"} Mehr erfahren
      </Link>
      <button className="border border-white/40 text-white/40 hover:border-white hover:text-white p-2">
        Download
      </button>
    </li>
  );
}

export default function ReleasesPreview() {
  const { data: changelogs } = useGetChangelogsQuery({ limit: 3 });

  return (
    <section className="mt-32 mb-16">
      <h2 className="font-extralight text-3xl mb-6 uppercase text-center tracking-widest">
        Versionen
      </h2>
      <ul className="grid grid-cols-3 gap-4">
        {changelogs?.slice(0, 3).map((changelog) => (
          <ReleasePreview
            version={changelog.version}
            releaseDate={changelog.releaseDate}
            content={changelog.content}
            downloadUrl={changelog.downloadUrl}
            key={changelog.id}
          />
        ))}
      </ul>
      <div className="flex mt-4 justify-center">
        <Link to="/releases" className="text-white/40">
          mehr
        </Link>
      </div>
    </section>
  );
}
