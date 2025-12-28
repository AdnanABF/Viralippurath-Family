interface Props {
  albums: string[];
  activeAlbum: string;
  onChange: (album: string) => void;
}

const GalleryFilters: React.FC<Props> = ({ albums, activeAlbum, onChange }) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 mb-12">
      {albums.map((album) => (
        <button
          key={album}
          onClick={() => onChange(album)}
          className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
            activeAlbum === album
              ? "bg-amber-700 text-white shadow-lg"
              : "bg-white text-stone-600 border border-stone-200 hover:border-amber-700"
          }`}
        >
          {album}
        </button>
      ))}
    </div>
  );
};

export default GalleryFilters;
