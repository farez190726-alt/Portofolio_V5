import React, { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react';
import { MessageCircle, UserCircle2, Loader2, AlertCircle, Send, ImagePlus, X, Pin, Flame } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import AOS from "aos";
import "aos/dist/aos.css";
import { supabase } from '../supabase';
import { getVisitorId } from '../utils/visitorId';

// Available reactions, in display order. "like" is the quick-tap default;
// the rest appear in the hover/tap picker, Facebook-style.
const REACTIONS = [
  { key: 'like', emoji: '👍', label: 'Like' },
  { key: 'love', emoji: '❤️', label: 'Love' },
  { key: 'haha', emoji: '😂', label: 'Haha' },
  { key: 'wow', emoji: '😮', label: 'Wow' },
  { key: 'sad', emoji: '😢', label: 'Sad' },
  { key: 'fire', emoji: '🔥', label: 'Fire' },
];
const REACTION_MAP = Object.fromEntries(REACTIONS.map((r) => [r.key, r]));

// ------------------------------------------------------------------
// Reaction bar: quick-tap Like + hover/tap picker + grouped counts
// ------------------------------------------------------------------
const ReactionBar = memo(({ commentId, summary, myReaction, onReact }) => {
  const [pickerOpen, setPickerOpen] = useState(false);
  const closeTimer = useRef(null);

  const openPicker = () => {
    clearTimeout(closeTimer.current);
    setPickerOpen(true);
  };
  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setPickerOpen(false), 350);
  };

  const totalCount = useMemo(
    () => Object.values(summary).reduce((a, b) => a + b, 0),
    [summary]
  );

  const topReactions = useMemo(
    () =>
      Object.entries(summary)
        .filter(([, count]) => count > 0)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([key]) => key),
    [summary]
  );

  const handleQuickTap = () => {
    onReact(commentId, myReaction ? null : 'like');
  };

  return (
    <div className="flex items-center gap-3 mt-2 relative">
      <div
        className="relative"
        onMouseEnter={openPicker}
        onMouseLeave={scheduleClose}
      >
        <button
          onClick={handleQuickTap}
          onTouchStart={openPicker}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all border ${
            myReaction
              ? 'bg-red-600/15 border-red-600/30 text-red-300'
              : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-white/5'
          }`}
        >
          <span className="text-sm leading-none">
            {myReaction ? REACTION_MAP[myReaction]?.emoji : '👍'}
          </span>
          {myReaction ? REACTION_MAP[myReaction]?.label : 'Like'}
        </button>

        {/* Emoji picker */}
        <AnimatePresence>
          {pickerOpen && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.9 }}
              transition={{ duration: 0.15 }}
              onMouseEnter={openPicker}
              onMouseLeave={scheduleClose}
              className="absolute bottom-full left-0 mb-2 flex items-center gap-1 px-2 py-1.5 rounded-full bg-[#140505] border border-white/10 shadow-xl z-20"
            >
              {REACTIONS.map((r) => (
                <button
                  key={r.key}
                  title={r.label}
                  onClick={() => {
                    onReact(commentId, myReaction === r.key ? null : r.key);
                    setPickerOpen(false);
                  }}
                  className={`text-lg leading-none p-1.5 rounded-full transition-transform hover:scale-125 hover:bg-white/10 ${
                    myReaction === r.key ? 'scale-110 bg-white/10' : ''
                  }`}
                >
                  {r.emoji}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Aggregated counts */}
      {totalCount > 0 && (
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <span className="flex -space-x-1">
            {topReactions.map((key) => (
              <span
                key={key}
                className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#161631] border border-[#050303] text-[10px] leading-none"
              >
                {REACTION_MAP[key]?.emoji}
              </span>
            ))}
          </span>
          <span>{totalCount}</span>
        </div>
      )}
    </div>
  );
});

const Comment = memo(({ comment, formatDate, isPinned = false, reactionSummary, myReaction, onReact }) => (
    <div
        className={`px-4 pt-4 pb-2 rounded-xl border transition-all group hover:shadow-lg hover:-translate-y-0.5 ${
            isPinned
                ? 'bg-gradient-to-r from-red-600/10 to-rose-600/10 border-red-600/30 hover:bg-gradient-to-r hover:from-red-600/15 hover:to-rose-600/15'
                : 'bg-white/5 border-white/10 hover:bg-white/10'
        }`}
    >
        {isPinned && (
            <div className="flex items-center gap-2 mb-3 text-red-500">
                <Pin className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wide">Pinned Comment</span>
            </div>
        )}
        <div className="flex items-start gap-3">
            {comment.profile_image ? (
                <img
                    src={comment.profile_image}
                    alt={`${comment.user_name}'s profile`}
                    className={`w-10 h-10 rounded-full object-cover border-2 flex-shrink-0  ${
                        isPinned ? 'border-red-600/50' : 'border-red-600/30'
                    }`}
                    loading="lazy"
                />
            ) : (
                <div className={`p-2 rounded-full text-red-500 group-hover:bg-red-600/30 transition-colors ${
                    isPinned ? 'bg-red-600/30' : 'bg-red-600/20'
                }`}>
                    <UserCircle2 className="w-5 h-5" />
                </div>
            )}
            <div className="flex-grow min-w-0">
                <div className="flex items-center justify-between gap-4 mb-2">
                    <div className="flex items-center gap-2">
                        <h4 className={`font-medium truncate ${
                            isPinned ? 'text-red-200' : 'text-white'
                        }`}>
                            {comment.user_name}
                        </h4>
                        {isPinned && (
                            <span className="px-2 py-0.5 text-xs bg-red-600/20 text-red-300 rounded-full">
                                Admin
                            </span>
                        )}
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                        {formatDate(comment.created_at)}
                    </span>
                </div>
                <p className="text-gray-300 text-sm break-words leading-relaxed relative bottom-2">
                    {comment.content}
                </p>
                <ReactionBar
                    commentId={comment.id}
                    summary={reactionSummary}
                    myReaction={myReaction}
                    onReact={onReact}
                />
            </div>
        </div>
    </div>
));

const CommentForm = memo(({ onSubmit, isSubmitting, error }) => {
    const [newComment, setNewComment] = useState('');
    const [userName, setUserName] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const textareaRef = useRef(null);
    const fileInputRef = useRef(null);

    const handleImageChange = useCallback((e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file size (5MB limit)
            if (file.size > 5 * 1024 * 1024) {
                alert('File size must be less than 5MB. Please choose a smaller image.');
                // Reset the input
                if (e.target) e.target.value = '';
                return;
            }

            // Check file type
            if (!file.type.startsWith('image/')) {
                alert('Please select a valid image file.');
                if (e.target) e.target.value = '';
                return;
            }

            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    }, []);

    const handleTextareaChange = useCallback((e) => {
        setNewComment(e.target.value);
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, []);

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        if (!newComment.trim() || !userName.trim()) return;

        onSubmit({ newComment, userName, imageFile });
        setNewComment('');
        setUserName('');
        setImagePreview(null);
        setImageFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        if (textareaRef.current) textareaRef.current.style.height = 'auto';
    }, [newComment, userName, imageFile, onSubmit]);

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2" data-aos="fade-up" data-aos-duration="1000">
                <label className="block text-sm font-medium text-white">
                    Name <span className="text-red-400">*</span>
                </label>
                <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                     maxLength={15}
                    placeholder="Enter your name"
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/20 transition-all"
                    required
                />
            </div>

            <div className="space-y-2" data-aos="fade-up" data-aos-duration="1200">
                <label className="block text-sm font-medium text-white">
                    Message <span className="text-red-400">*</span>
                </label>
                <textarea
                    ref={textareaRef}
                    value={newComment}
                     maxLength={200}

                    onChange={handleTextareaChange}
                    placeholder="Write your message here..."
                    className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/20 transition-all resize-none min-h-[120px]"
                    required
                />
            </div>

            <div className="space-y-2" data-aos="fade-up" data-aos-duration="1400">
                <label className="block text-sm font-medium text-white">
                    Profile Photo <span className="text-gray-400">(optional)</span>
                </label>
                <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-xl">
                    {imagePreview ? (
                        <div className="flex items-center gap-4">
                            <img
                                src={imagePreview}
                                alt="Profile preview"
                                className="w-16 h-16 rounded-full object-cover border-2 border-red-600/50"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    setImagePreview(null);
                                    setImageFile(null);
                                    if (fileInputRef.current) fileInputRef.current.value = '';
                                }}
                                className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all group"
                            >
                                <X className="w-4 h-4" />
                                <span>Remove Photo</span>
                            </button>
                        </div>
                    ) : (
                        <div className="w-full">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                accept="image/*"
                                className="hidden"
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-600/20 text-red-500 hover:bg-red-600/30 transition-all border border-dashed border-red-600/50 hover:border-red-600 group"
                            >
                                <ImagePlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                <span>Choose Profile Photo</span>
                            </button>
                            <p className="text-center text-gray-400 text-sm mt-2">
                                Max file size: 5MB
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                data-aos="fade-up" data-aos-duration="1000"
                className="relative w-full h-12 bg-gradient-to-r from-[#2563eb] to-[#dc2626] rounded-xl font-medium text-white overflow-hidden group transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
            >
                <div className="absolute inset-0 bg-white/20 translate-y-12 group-hover:translate-y-0 transition-transform duration-300" />
                <div className="relative flex items-center justify-center gap-2">
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Posting...</span>
                        </>
                    ) : (
                        <>
                            <Send className="w-4 h-4" />
                            <span>Post Comment</span>
                        </>
                    )}
                </div>
            </button>
        </form>
    );
});

const Komentar = () => {
    const [comments, setComments] = useState([]);
    const [pinnedComment, setPinnedComment] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'popular'
    const [reactions, setReactions] = useState([]); // raw rows: {comment_id, emoji, visitor_id}
    const visitorId = useMemo(() => getVisitorId(), []);

    useEffect(() => {
        // Initialize AOS
        AOS.init({
            once: false,
            duration: 1000,
        });
    }, []);

    // Fetch pinned comment
    useEffect(() => {
        const fetchPinnedComment = async () => {
            try {
                const { data, error } = await supabase
                    .from('portfolio_comments')
                    .select('*')
                    .eq('is_pinned', true)
                    .single();

                if (error && error.code !== 'PGRST116') {
                    console.error('Error fetching pinned comment:', error);
                    return;
                }

                if (data) {
                    setPinnedComment(data);
                }
            } catch (error) {
                console.error('Error fetching pinned comment:', error);
            }
        };

        fetchPinnedComment();
    }, []);

    // Fetch regular comments (excluding pinned) and set up real-time subscription
    useEffect(() => {
        const fetchComments = async () => {
            const { data, error } = await supabase
                .from('portfolio_comments')
                .select('*')
                .eq('is_pinned', false)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching comments:', error);
                return;
            }

            setComments(data || []);
        };

        fetchComments();

        // Set up real-time subscription
        const subscription = supabase
            .channel('portfolio_comments')
            .on('postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'portfolio_comments',
                    filter: 'is_pinned=eq.false'
                },
                () => {
                    fetchComments(); // Refresh comments when changes occur
                }
            )
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    // Fetch all comment reactions + live-sync via realtime
    useEffect(() => {
        const fetchReactions = async () => {
            const { data, error } = await supabase
                .from('comment_reactions')
                .select('comment_id, emoji, visitor_id');
            if (error) {
                console.error('Error fetching reactions:', error);
                return;
            }
            setReactions(data || []);
        };

        fetchReactions();

        const channel = supabase
            .channel('comment_reactions_realtime')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'comment_reactions' }, fetchReactions)
            .subscribe();

        return () => {
            channel.unsubscribe();
        };
    }, []);

    // Build per-comment reaction summaries + "my reaction" lookup
    const { summaryByComment, myReactionByComment } = useMemo(() => {
        const summary = {};
        const mine = {};
        reactions.forEach((r) => {
            if (!summary[r.comment_id]) {
                summary[r.comment_id] = Object.fromEntries(REACTIONS.map((x) => [x.key, 0]));
            }
            if (summary[r.comment_id][r.emoji] !== undefined) {
                summary[r.comment_id][r.emoji] += 1;
            }
            if (r.visitor_id === visitorId) {
                mine[r.comment_id] = r.emoji;
            }
        });
        return { summaryByComment: summary, myReactionByComment: mine };
    }, [reactions, visitorId]);

    const getSummary = useCallback(
        (commentId) => summaryByComment[commentId] || Object.fromEntries(REACTIONS.map((x) => [x.key, 0])),
        [summaryByComment]
    );

    const handleReact = useCallback(
        async (commentId, emojiKeyOrNull) => {
            const existing = myReactionByComment[commentId];

            // Optimistic local update
            setReactions((prev) => {
                const withoutMine = prev.filter((r) => !(r.comment_id === commentId && r.visitor_id === visitorId));
                if (!emojiKeyOrNull) return withoutMine;
                return [...withoutMine, { comment_id: commentId, emoji: emojiKeyOrNull, visitor_id: visitorId }];
            });

            try {
                if (!emojiKeyOrNull) {
                    await supabase
                        .from('comment_reactions')
                        .delete()
                        .eq('comment_id', commentId)
                        .eq('visitor_id', visitorId);
                } else if (existing) {
                    await supabase
                        .from('comment_reactions')
                        .update({ emoji: emojiKeyOrNull })
                        .eq('comment_id', commentId)
                        .eq('visitor_id', visitorId);
                } else {
                    await supabase
                        .from('comment_reactions')
                        .insert({ comment_id: commentId, emoji: emojiKeyOrNull, visitor_id: visitorId });
                }
            } catch (err) {
                console.error('Error saving reaction:', err);
            }
        },
        [myReactionByComment, visitorId]
    );

    const uploadImage = useCallback(async (imageFile) => {
        if (!imageFile) return null;

        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `profile-images/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('profile-images')
            .upload(filePath, imageFile);

        if (uploadError) {
            throw uploadError;
        }

        const { data } = supabase.storage
            .from('profile-images')
            .getPublicUrl(filePath);

        return data.publicUrl;
    }, []);

    const handleCommentSubmit = useCallback(async ({ newComment, userName, imageFile }) => {
        setError('');
        setIsSubmitting(true);

        try {
            const profileImageUrl = await uploadImage(imageFile);

            const { error } = await supabase
                .from('portfolio_comments')
                .insert([
                    {
                        content: newComment,
                        user_name: userName,
                        profile_image: profileImageUrl,
                        is_pinned: false,
                        created_at: new Date().toISOString()
                    }
                ]);

            if (error) {
                throw error;
            }
        } catch (error) {
            // Surface the real Supabase error instead of a generic message,
            // so the actual cause (RLS policy, missing bucket, bad env vars, etc.)
            // is visible instead of being swallowed.
            const message =
                error?.message ||
                error?.error_description ||
                (typeof error === 'string' ? error : null) ||
                'Failed to post comment. Please try again.';
            setError(message);
            console.error('Error adding comment:', {
                message: error?.message,
                details: error?.details,
                hint: error?.hint,
                code: error?.code,
                raw: error,
            });
        } finally {
            setIsSubmitting(false);
        }
    }, [uploadImage]);

    const formatDate = useCallback((timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        const now = new Date();
        const diffMinutes = Math.floor((now - date) / (1000 * 60));
        const diffHours = Math.floor(diffMinutes / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMinutes < 1) return 'Just now';
        if (diffMinutes < 60) return `${diffMinutes}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;

        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }).format(date);
    }, []);

    // Sort regular comments by newest or by total reaction count
    const sortedComments = useMemo(() => {
        if (sortBy !== 'popular') return comments;
        const totalFor = (id) => Object.values(getSummary(id)).reduce((a, b) => a + b, 0);
        return [...comments].sort((a, b) => totalFor(b.id) - totalFor(a.id));
    }, [comments, sortBy, getSummary]);

    // Calculate total comments (pinned + regular)
    const totalComments = comments.length + (pinnedComment ? 1 : 0);

    return (
        <div className="w-full bg-gradient-to-b from-white/10 to-white/5 rounded-2xl  backdrop-blur-xl shadow-xl" data-aos="fade-up" data-aos-duration="1000">
            <div className="p-6 border-b border-white/10" data-aos="fade-down" data-aos-duration="800">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-red-600/20">
                            <MessageCircle className="w-6 h-6 text-red-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-white">
                            Comments <span className="text-red-500">({totalComments})</span>
                        </h3>
                    </div>

                    {comments.length > 1 && (
                        <div className="flex gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
                            <button
                                onClick={() => setSortBy('newest')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                    sortBy === 'newest'
                                        ? 'bg-red-600/25 border border-red-600/35 text-white'
                                        : 'text-gray-500 hover:text-gray-300'
                                }`}
                            >
                                Newest
                            </button>
                            <button
                                onClick={() => setSortBy('popular')}
                                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                    sortBy === 'popular'
                                        ? 'bg-red-600/25 border border-red-600/35 text-white'
                                        : 'text-gray-500 hover:text-gray-300'
                                }`}
                            >
                                <Flame className="w-3 h-3" /> Popular
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <div className="p-6 space-y-6">
                {error && (
                    <div className="flex items-center gap-2 p-4 text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl" data-aos="fade-in">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p className="text-sm">{error}</p>
                    </div>
                )}

                <div>
                    <CommentForm onSubmit={handleCommentSubmit} isSubmitting={isSubmitting} error={error} />
                </div>

                <div className="space-y-4 h-[328px] overflow-y-auto overflow-x-hidden custom-scrollbar pt-1 pr-1 " data-aos="fade-up" data-aos-delay="200">
                    {/* Pinned Comment */}
                    {pinnedComment && (
                        <div data-aos="fade-down" data-aos-duration="800">
                            <Comment
                                comment={pinnedComment}
                                formatDate={formatDate}
                                isPinned={true}
                                reactionSummary={getSummary(pinnedComment.id)}
                                myReaction={myReactionByComment[pinnedComment.id]}
                                onReact={handleReact}
                            />
                        </div>
                    )}

                    {/* Regular Comments */}
                    {comments.length === 0 && !pinnedComment ? (
                        <div className="text-center py-8" data-aos="fade-in">
                            <UserCircle2 className="w-12 h-12 text-red-500 mx-auto mb-3 opacity-50" />
                            <p className="text-gray-400">No comments yet. Start the conversation!</p>
                        </div>
                    ) : (
                        sortedComments.map((comment) => (
                            <Comment
                                key={comment.id}
                                comment={comment}
                                formatDate={formatDate}
                                isPinned={false}
                                reactionSummary={getSummary(comment.id)}
                                myReaction={myReactionByComment[comment.id]}
                                onReact={handleReact}
                            />
                        ))
                    )}
                </div>
            </div>
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(99, 102, 241, 0.5);
                    border-radius: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(99, 102, 241, 0.7);
                }
            `}</style>
        </div>
    );
};

export default Komentar;
