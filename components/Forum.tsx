import React, { useState, useEffect } from 'react';
// FIX: Imported the User type to resolve a reference error.
import { Course, ForumPost, ForumReply, User } from '../types';
<<<<<<< HEAD
import { getForumPosts, addForumPost, addForumReply } from '../services/mockApiService';
=======
import { getForumPosts, addForumPost, addForumReply } from '../services/apiService';
>>>>>>> a912287 (Added Firebase Cloud Functions backend and integrated course creation)
import { getAIForumResponse } from '../services/geminiService';
import { useAuth } from '../contexts/AuthContext';
import { UserIcon, SparklesIcon, ChevronDownIcon, ChevronUpIcon } from './icons/Icons';

interface ForumProps {
  course: Course;
}

const Forum: React.FC<ForumProps> = ({ course }) => {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();

  // State for new post form
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State for replies
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [expandedPosts, setExpandedPosts] = useState<Set<number>>(new Set());
  
  const [askingAI, setAskingAI] = useState<number | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const fetchedPosts = await getForumPosts(course.id);
        setPosts(fetchedPosts);
      } catch (err) {
        setError('Failed to load discussion posts.');
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [course.id]);

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newPostTitle.trim() || !newPostContent.trim()) return;
    
    setIsSubmitting(true);
    try {
        const newPost = await addForumPost(course.id, user, newPostTitle, newPostContent);
        setPosts(prev => [newPost, ...prev]);
        setNewPostTitle('');
        setNewPostContent('');
        setIsCreatingPost(false);
        setExpandedPosts(prev => new Set(prev).add(newPost.id));
    } catch (err) {
        alert("Failed to create post. Please try again.");
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleReplySubmit = async (postId: number) => {
    if (!user || !replyContent.trim()) return;

    setIsSubmitting(true);
    try {
        const newReply = await addForumReply(postId, user, replyContent);
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, replies: [...p.replies, newReply] } : p));
        setReplyContent('');
        setReplyingTo(null);
    } catch (err) {
        alert("Failed to submit reply. Please try again.");
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleAskAI = async (post: ForumPost) => {
    if (!user) return;
    setAskingAI(post.id);
    try {
        const courseContent = course.lessons.map(l => `Title: ${l.title}\nContent: ${l.content}`).join('\n\n');
        const aiResponse = await getAIForumResponse(post.title, post.content, courseContent);
        
        const aiUser = {id: 0, name: 'AI Assistant', role: 'trainer'} as User;
        const newReply = await addForumReply(post.id, aiUser, aiResponse);

        setPosts(prev => prev.map(p => p.id === post.id ? { ...p, replies: [...p.replies, newReply] } : p));
    } catch (error) {
        alert("The AI assistant failed to generate a response.");
    } finally {
        setAskingAI(null);
    }
  };

  const toggleExpand = (postId: number) => {
    setExpandedPosts(prev => {
        const newSet = new Set(prev);
        if (newSet.has(postId)) {
            newSet.delete(postId);
        } else {
            newSet.add(postId);
        }
        return newSet;
    });
  };

  if (loading) return <p>Loading discussions...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Discussion Forum</h2>
            <button
                onClick={() => setIsCreatingPost(p => !p)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
                {isCreatingPost ? 'Cancel' : 'Start a New Discussion'}
            </button>
        </div>

        {isCreatingPost && (
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-6">
                <form onSubmit={handlePostSubmit} className="space-y-4">
                    <input type="text" placeholder="Question or topic title..." value={newPostTitle} onChange={e => setNewPostTitle(e.target.value)} required className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
                    <textarea placeholder="Elaborate on your question or topic..." value={newPostContent} onChange={e => setNewPostContent(e.target.value)} required rows={4} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"></textarea>
                    <div className="text-right">
                        <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-400">
                            {isSubmitting ? 'Posting...' : 'Post Discussion'}
                        </button>
                    </div>
                </form>
            </div>
        )}

        <div className="space-y-4">
            {posts.map(post => (
                <div key={post.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                    <div className="flex justify-between items-start cursor-pointer" onClick={() => toggleExpand(post.id)}>
                        <div>
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white">{post.title}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Asked by {post.authorName} on {new Date(post.createdAt).toLocaleDateString()}</p>
                        </div>
                        {expandedPosts.has(post.id) ? <ChevronUpIcon className="w-5 h-5"/> : <ChevronDownIcon className="w-5 h-5"/>}
                    </div>

                    {expandedPosts.has(post.id) && (
                        <div className="mt-4 pl-4 border-l-2 dark:border-gray-700 space-y-4">
                            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{post.content}</p>

                            <button onClick={() => handleAskAI(post)} disabled={askingAI === post.id} className="inline-flex items-center text-sm text-blue-600 hover:underline disabled:opacity-50">
                                <SparklesIcon className="w-4 h-4 mr-1"/>
                                {askingAI === post.id ? 'Thinking...' : 'Ask AI for help'}
                            </button>

                            <h4 className="font-semibold pt-4 border-t dark:border-gray-700">{post.replies.length} Replies</h4>
                            {post.replies.map(reply => (
                                <div key={reply.id} className="flex space-x-3">
                                    <div className={`p-2 rounded-full h-fit ${reply.authorName === 'AI Assistant' ? 'bg-blue-100 dark:bg-blue-900' : 'bg-gray-200 dark:bg-gray-600'}`}>
                                        {reply.authorName === 'AI Assistant' ? <SparklesIcon className="w-5 h-5 text-blue-500" /> : <UserIcon className="w-5 h-5"/>}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm">{reply.authorName} <span className="text-xs text-gray-500 font-normal">{new Date(reply.createdAt).toLocaleDateString()}</span></p>
                                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{reply.content}</p>
                                    </div>
                                </div>
                            ))}

                            {replyingTo === post.id ? (
                                <div className="pt-2">
                                    <textarea value={replyContent} onChange={e => setReplyContent(e.target.value)} rows={3} className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" placeholder="Write your reply..."></textarea>
                                    <div className="flex space-x-2 justify-end mt-2">
                                        <button onClick={() => setReplyingTo(null)} className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-600 rounded-md">Cancel</button>
                                        <button onClick={() => handleReplySubmit(post.id)} disabled={isSubmitting} className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md disabled:bg-blue-400">Submit Reply</button>
                                    </div>
                                </div>
                            ) : (
                                <button onClick={() => setReplyingTo(post.id)} className="text-sm font-semibold text-blue-600 hover:underline mt-2">Reply</button>
                            )}
                        </div>
                    )}
                </div>
            ))}
        </div>
    </div>
  );
};

export default Forum;