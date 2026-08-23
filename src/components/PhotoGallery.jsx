import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, X, ChevronLeft, ChevronRight, Eye, Camera, ImageOff } from "lucide-react";
import { supabase } from "../supabase";
import { getVisitorId } from "../utils/visitorId";

const ToggleButton = ({ onClick, isShowingMore }) => (
  <button
    onClick={onClick}
    className="px-3 py-1.5 text-slate-300 hover:text-white text-sm font-medium transition-all duration-300 ease-in-out flex items-center gap-2 bg-white/5 hover:bg-white/10 rounded-md border border-white/10 hover:border-white/20 backdrop-blur-sm group relative overflow-hidden"
  >
    <span className="relative z-10 flex items-center gap-2">
      {isShowingMore ? "See Less" : "See More"}
      <svg
        xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        className={`transition-transform duration-300 ${isShowingMore ? "group-hover:-translate-y-0.5" : "group-hover:translate-y-0.5"}`}
      >
        <polyline points={isShowingMore ? "18 15 12 9 6 15" : "6 9 12 15 18 9"}></polyline>
      </svg>
    </span>
    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-500/50 transition-all duration-300 group-hover:w-full"></span>
  </button>
);

const PhotoCard = memo(({ photo, liked, likeCount, onOpen, onToggleLike }) => {
  const [loaded, setLoaded] = useState(false);
  const [pulse, setPulse] = useState(false);

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    if (!liked) setPulse(true);
    onToggleLike(photo.id);
  };

  return (
    <div
      className="relative group rounded-xl overflow-hidden cursor-pointer bg-white/5 border border-white/10 hover:border-indigo-500/40 transition-all duration-300"
      onClick={() => onOpen(photo)}
      onDoubleClick={handleDoubleClick}
    >
      {!loaded && <div className="absolute inset-0 bg-white/5 animate-pulse" />}
      <img
        src={photo.image_url}
        alt={photo.caption || "Photo"}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={`w-full aspect-square object-cover transition-all duration-500 group-hover:scale-110 ${loaded ? "opacity-100" : "opacity-0"}`}
      />

      {/* Heart burst animation on double-click */}
      <AnimatePresence>
        {pulse && (
          <motion.div
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1.3 }}
            exit={{ opacity: 0, scale: 1.6 }}
            transition={{ duration: 0.5 }}
            onAnimationComplete={() => setPulse(false)}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <Heart className="w-16 h-16 text-pink-500 drop-shadow-lg" fill="currentColor" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
        {photo.caption && (
          <p className="text-white text-xs sm:text-sm font-medium line-clamp-2 mb-1.5">{photo.caption}</p>
        )}
        <div className="flex items-center gap-3 text-xs text-gray-300">
          <button
            onClick={(e) => { e.stopPropagation(); onToggleLike(photo.id); }}
            className={`flex items-center gap-1 transition-colors ${liked ? "text-pink-400" : "text-gray-300 hover:text-pink-400"}`}
          >
            <Heart className="w-3.5 h-3.5" fill={liked ? "currentColor" : "none"} />
            {likeCount}
          </button>
          {typeof photo.views === "number" && (
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" /> {photo.views}
            </span>
          )}
        </div>
      </div>

      {/* Category chip */}
      {photo.category && (
        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-sm text-[10px] text-indigo-200 border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
          {photo.category}
        </span>
      )}
    </div>
  );
});

const Lightbox = ({ photos, index, onClose, onIndexChange, liked, likeCount, onToggleLike }) => {
  const photo = photos[index];

  const goPrev = useCallback(
    () => onIndexChange((index - 1 + photos.length) % photos.length),
    [index, photos.length, onIndexChange]
  );
  const goNext = useCallback(
    () => onIndexChange((index + 1) % photos.length),
    [index, photos.length, onIndexChange]
  );

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, goPrev, goNext]);

  if (!photo) return null;
  const isLiked = liked.has(photo.id);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center"
        onClick={onClose}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 md:top-6 md:right-6 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        >
          <X className="w-5 h-5 md:w-6 md:h-6" />
        </button>

        {photos.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              aria-label="Previous photo"
              className="absolute left-2 md:left-6 z-10 p-2 md:p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              aria-label="Next photo"
              className="absolute right-2 md:right-6 z-10 p-2 md:p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </>
        )}

        <div
          className="relative max-w-[92vw] max-h-[86vh] flex flex-col items-center gap-3"
          onClick={(e) => e.stopPropagation()}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={photo.id}
              src={photo.image_url}
              alt={photo.caption || `Photo ${index + 1}`}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.18 }}
              className="max-w-[92vw] max-h-[70vh] object-contain rounded-lg shadow-2xl"
            />
          </AnimatePresence>

          <div className="flex flex-col items-center gap-2 text-center px-4">
            {photo.caption && <p className="text-white text-sm sm:text-base max-w-xl">{photo.caption}</p>}
            <div className="flex items-center gap-4">
              <button
                onClick={() => onToggleLike(photo.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all ${
                  isLiked
                    ? "bg-pink-500/20 border-pink-500/40 text-pink-300"
                    : "bg-white/5 border-white/15 text-gray-300 hover:border-pink-400/40 hover:text-pink-300"
                }`}
              >
                <Heart className="w-4 h-4" fill={isLiked ? "currentColor" : "none"} />
                <span className="text-xs">{likeCount.get(photo.id) || 0}</span>
              </button>
              {typeof photo.views === "number" && (
                <span className="flex items-center gap-1.5 text-gray-400 text-xs">
                  <Eye className="w-4 h-4" /> {photo.views} views
                </span>
              )}
              {photos.length > 1 && (
                <span className="text-xs text-white/60 bg-black/40 px-3 py-1 rounded-full">
                  {index + 1} / {photos.length}
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

const PhotoGallery = () => {
  const [photos, setPhotos] = useState([]);
  const [likeCounts, setLikeCounts] = useState(new Map());
  const [likedByMe, setLikedByMe] = useState(new Set());
  const [activeCategory, setActiveCategory] = useState("All");
  const [showAll, setShowAll] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const visitorId = useMemo(() => getVisitorId(), []);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const initialItems = isMobile ? 8 : 12;

  const fetchPhotos = useCallback(async () => {
    const { data, error } = await supabase
      .from("gallery_photos")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) setPhotos(data || []);
    setLoading(false);
  }, []);

  const fetchLikes = useCallback(async () => {
    const { data, error } = await supabase.from("photo_likes").select("photo_id, visitor_id");
    if (error) return;
    const counts = new Map();
    const mine = new Set();
    (data || []).forEach((row) => {
      counts.set(row.photo_id, (counts.get(row.photo_id) || 0) + 1);
      if (row.visitor_id === visitorId) mine.add(row.photo_id);
    });
    setLikeCounts(counts);
    setLikedByMe(mine);
  }, [visitorId]);

  useEffect(() => {
    fetchPhotos();
    fetchLikes();

    const channel = supabase
      .channel("gallery_likes_realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "photo_likes" }, fetchLikes)
      .on("postgres_changes", { event: "*", schema: "public", table: "gallery_photos" }, fetchPhotos)
      .subscribe();

    return () => channel.unsubscribe();
  }, [fetchPhotos, fetchLikes]);

  const categories = useMemo(() => {
    const set = new Set(photos.map((p) => p.category || "General"));
    return ["All", ...Array.from(set)];
  }, [photos]);

  const filtered = useMemo(() => {
    if (activeCategory === "All") return photos;
    return photos.filter((p) => (p.category || "General") === activeCategory);
  }, [photos, activeCategory]);

  const displayed = showAll ? filtered : filtered.slice(0, initialItems);

  const toggleLike = useCallback(
    async (photoId) => {
      const alreadyLiked = likedByMe.has(photoId);

      // Optimistic update
      setLikedByMe((prev) => {
        const next = new Set(prev);
        alreadyLiked ? next.delete(photoId) : next.add(photoId);
        return next;
      });
      setLikeCounts((prev) => {
        const next = new Map(prev);
        const current = next.get(photoId) || 0;
        next.set(photoId, Math.max(0, alreadyLiked ? current - 1 : current + 1));
        return next;
      });

      if (alreadyLiked) {
        await supabase.from("photo_likes").delete().eq("photo_id", photoId).eq("visitor_id", visitorId);
      } else {
        await supabase.from("photo_likes").insert({ photo_id: photoId, visitor_id: visitorId });
      }
    },
    [likedByMe, visitorId]
  );

  const openLightbox = useCallback(
    (photo) => {
      const idx = displayed.findIndex((p) => p.id === photo.id);
      setLightboxIndex(idx === -1 ? 0 : idx);
      supabase.rpc("increment_photo_views", { photo_id: photo.id }).then(() => {
        setPhotos((prev) => prev.map((p) => (p.id === photo.id ? { ...p, views: (p.views || 0) + 1 } : p)));
      });
    },
    [displayed]
  );

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-square rounded-xl bg-white/5 animate-pulse" />
        ))}
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="text-center py-16">
        <Camera className="w-10 h-10 text-gray-700 mx-auto mb-3" />
        <p className="text-gray-500 text-sm">No photos yet. Check back soon!</p>
      </div>
    );
  }

  return (
    <div>
      {/* Category filter */}
      {categories.length > 2 && (
        <div className="flex flex-wrap gap-2 mb-5 justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setShowAll(false); }}
              className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium border transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-gradient-to-r from-indigo-500/25 to-purple-500/20 border-indigo-500/40 text-white"
                  : "border-white/10 text-gray-400 hover:text-gray-200 hover:border-white/20"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {displayed.map((photo, i) => (
          <div key={photo.id} data-aos={i % 3 === 0 ? "fade-up-right" : i % 3 === 1 ? "fade-up" : "fade-up-left"} data-aos-duration="1000">
            <PhotoCard
              photo={photo}
              liked={likedByMe.has(photo.id)}
              likeCount={likeCounts.get(photo.id) || 0}
              onOpen={openLightbox}
              onToggleLike={toggleLike}
            />
          </div>
        ))}
      </div>

      {filtered.length > initialItems && (
        <div className="mt-6 w-full flex justify-start">
          <ToggleButton onClick={() => setShowAll((s) => !s)} isShowingMore={showAll} />
        </div>
      )}

      {lightboxIndex !== null && (
        <Lightbox
          photos={displayed}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onIndexChange={setLightboxIndex}
          liked={likedByMe}
          likeCount={likeCounts}
          onToggleLike={toggleLike}
        />
      )}
    </div>
  );
};

export default memo(PhotoGallery);
