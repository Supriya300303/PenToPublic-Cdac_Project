import React, { useEffect, useState } from 'react';
import {
  Card, CardContent, CardFooter, CardTitle, CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import { fetchBooksWithFiles, fetchTopBooks } from '@/services/bookService';
import Header from '@/layout/Header';
import Footer from '@/layout/Footer';
import { Badge } from '@/components/ui/badge';
import {
  CalendarDays, User, BookOpen, Heart, Eye, Play, Star
} from 'lucide-react';

const getDriveImageLink = (url) => {
  try {
    const match = url?.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (match?.[1]) {
      const id = encodeURIComponent(match[1]);
      return `https://drive.google.com/uc?export=view&id=${id}`;
    }
  } catch {}
  return '/fallback-image.png';
};

const ReaderDashboard = ({ userSubscription = 'free' }) => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [likedBooks, setLikedBooks] = useState(new Set());
  
  const isSubscribed = userSubscription === 'premium' || userSubscription === 'subscribed';

  const loadBooks = async () => {
    try {
      const fetched = filter === 'top'
        ? await fetchTopBooks()
        : await fetchBooksWithFiles();

      let sorted = [...fetched];
      
      // Don't filter books by subscription - show all books but restrict access
      // if (!isSubscribed) {
      //   sorted = sorted.filter(b => b.isFree || b.price === 0);
      // }
      
      if (filter === 'recent') {
        sorted.sort((a, b) =>
          new Date(b.uploadDate || b.createdAt) -
          new Date(a.uploadDate || a.createdAt)
        );
      } else if (filter === 'free') {
        sorted = sorted.filter(b => b.isFree || b.price === 0);
      } else if (filter === 'audio') {
        sorted = sorted.filter(b => b.bookFiles?.[0]?.audioPath);
      }

      setBooks(sorted);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    setSearch('');
    loadBooks();
  }, [filter]);

  const toggleLike = (bookId) => {
    setLikedBooks(prev => {
      const next = new Set(prev);
      next.has(bookId) ? next.delete(bookId) : next.add(bookId);
      return next;
    });
  };

  const filteredBooks = books.filter(b =>
    b.title?.toLowerCase().includes(search.toLowerCase()) ||
    b.author?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header search={search} setSearch={setSearch} setFilter={setFilter} />

      <main className="flex-grow px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6">
            All Books ({filteredBooks.length})
            {!isSubscribed && (
              <span className="ml-2 text-sm font-normal text-gray-500">
                - Subscribe for premium access
              </span>
            )}
          </h2>

          {filteredBooks.length === 0 ? (
            <div className="flex flex-col items-center py-20 text-center">
              <BookOpen className="w-16 h-16 text-gray-400 mb-4"/>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No books found
              </h3>
              <p className="text-gray-500">Try adjusting search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-center">
              {filteredBooks.map(book => {
                const file = book.bookFiles?.[0];
                const frontPage = file?.frontPageLink;
                const imageUrl = frontPage ? getDriveImageLink(frontPage) : '/fallback-image.png';
                const uploadDate = book.uploadDate
                  ? new Date(book.uploadDate).toLocaleDateString()
                  : 'Unknown';
                const id = book.bookId || book.id;
                const isLiked = likedBooks.has(id);
                const hasAudio = Boolean(file?.audioPath);
                const hasPdf = Boolean(file?.pdfPath);
                const isFreeBook = book.isFree || book.price === 0;
                const canAccess = isSubscribed || isFreeBook;

                return (
                  <Card
                    key={id}
                    className={`w-64 h-[540px] flex flex-col justify-between overflow-hidden shadow-xl bg-white group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-0 rounded-2xl ${!canAccess ? 'opacity-60' : ''}`}
                  >
                    {/* Enhanced Book Cover Design */}
                    <div className="aspect-[3/4] w-full relative overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center group-hover:from-indigo-600 group-hover:via-purple-600 group-hover:to-pink-600 transition-all duration-500">
                      {/* Decorative Elements */}
                      <div className="absolute inset-0 bg-black/20"></div>
                      <div className="absolute top-4 left-4 w-8 h-1 bg-white/30 rounded-full"></div>
                      <div className="absolute top-6 left-4 w-12 h-1 bg-white/20 rounded-full"></div>
                      <div className="absolute bottom-4 right-4 w-6 h-6 border-2 border-white/30 rounded-full"></div>
                      
                      {/* Premium Lock Overlay for Unsubscribed Users */}
                      {!canAccess && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
                          <div className="bg-white/90 rounded-lg p-3 flex flex-col items-center gap-1">
                            <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-bold">🔒</span>
                            </div>
                            <span className="text-xs font-semibold text-gray-700">Premium</span>
                          </div>
                        </div>
                      )}
                      
                      {/* Main Book Icon */}
                      <div className="relative z-10 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-xl">
                        <BookOpen className="w-12 h-12 text-white drop-shadow-lg" />
                      </div>
                      
                      {/* Floating Elements */}
                      <div className="absolute top-8 right-8 w-2 h-2 bg-white/40 rounded-full animate-pulse"></div>
                      <div className="absolute bottom-8 left-8 w-1 h-1 bg-white/60 rounded-full animate-pulse delay-300"></div>
                    </div>

                    {/* Content */}
                    <CardContent className="flex flex-col flex-grow space-y-2 pt-5 px-5 pb-2">
                      <CardTitle className="text-base font-bold line-clamp-2 text-gray-800 group-hover:text-indigo-600 transition-colors duration-300">
                        {book.title}
                      </CardTitle>
                      <CardDescription className="text-sm line-clamp-2 text-gray-600 leading-relaxed">
                        {book.description}
                      </CardDescription>

                      <div className="space-y-2 pt-2">
                        <div className="text-sm text-gray-500 flex items-center gap-2 bg-gray-50 rounded-full px-3 py-1.5">
                          <User className="w-4 h-4 text-indigo-500" />
                          <span className="font-medium">{book.author?.name || 'Unknown'}</span>
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-2 bg-gray-50 rounded-full px-3 py-1.5">
                          <CalendarDays className="w-4 h-4 text-purple-500" />
                          <span>{uploadDate}</span>
                        </div>
                      </div>
                    </CardContent>

                    {/* Footer */}
                    <CardFooter className="flex justify-between items-center px-5 pb-5 pt-0">
                      <Badge className={`text-white text-xs px-3 py-1.5 flex items-center gap-1.5 rounded-full shadow-md ${
                        isFreeBook 
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                          : 'bg-gradient-to-r from-yellow-500 to-orange-500'
                      }`}>
                        <Star className="w-3 h-3" /> 
                        <span className="font-medium">{isFreeBook ? 'Free' : 'Premium'}</span>
                      </Badge>

                      <div className="flex items-center gap-2">
                        {/* PDF Viewer */}
                        {hasPdf && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <button 
                                className={`p-2.5 rounded-full shadow-lg transition-all duration-200 ${
                                  canAccess 
                                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 hover:shadow-xl transform hover:scale-110' 
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                                onClick={(e) => {
                                  if (!canAccess) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    alert('Please subscribe to access premium books!');
                                  }
                                }}
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </DialogTrigger>
                            {canAccess && (
                              <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden p-4">
                                <div className="flex flex-col h-full space-y-4">
                                  <div className="space-y-1">
                                    <h2 className="text-xl font-bold text-gray-800">{book.title}</h2>
                                    <p className="text-sm text-gray-600">{book.description}</p>
                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                      <User className="w-4 h-4" />
                                      <span>{book.author?.name || 'Unknown'}</span>
                                    </div>
                                  </div>
                                  <div className="flex-grow overflow-auto rounded-md">
                                    <iframe
                                      src={file.pdfPath.replace('/view?usp=sharing','/preview')}
                                      width="100%"
                                      height="500"
                                      title="PDF Preview"
                                      className="rounded-md"
                                      allow="autoplay"
                                    ></iframe>
                                  </div>
                                </div>
                              </DialogContent>
                            )}
                          </Dialog>
                        )}

                        {/* Audio Player */}
                        {hasAudio && !hasPdf && (
                          <button
                            className={`p-2.5 rounded-full shadow-lg transition-all duration-200 ${
                              canAccess 
                                ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 hover:shadow-xl transform hover:scale-110' 
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                            onClick={() => {
                              if (canAccess) {
                                const a = new Audio(file.audioPath);
                                a.play();
                              } else {
                                alert('Please subscribe to access premium books!');
                              }
                            }}
                          >
                            <Play className="w-4 h-4" />
                          </button>
                        )}

                        {/* Like Button */}
                        <button
                          className={`p-2.5 rounded-full shadow-lg transform hover:scale-110 transition-all duration-200 ${
                            isLiked 
                              ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-red-200 hover:from-red-600 hover:to-pink-600' 
                              : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-red-500'
                          }`}
                          onClick={() => toggleLike(id)}
                        >
                          <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ReaderDashboard;