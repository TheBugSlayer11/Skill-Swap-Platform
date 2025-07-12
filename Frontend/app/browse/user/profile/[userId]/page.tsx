'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { AppLayout } from '@/components/app-layout';
import { Star, Eye, UserCheck, Award, MessageSquare, Share2, Heart, Zap, Trophy, Users, Clock, MapPin, TrendingUp, Calendar, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
// import { RequestSwapModal } from '@/components/request-swap-modal';
// import { authService } from '@/lib/auth';

type Rating = {
  score: number;
  feedback: string;
  rated_at: string;
};

type User = {
  _id: string;
  username: string;
  fullname: string;
  email: string;
  clerk_id: string;
  address: string;
  profile_url: string;
  skills_offered: string[];
  skills_wanted: string[];
  availability: string;
  is_public: boolean;
  is_banned: boolean;
  rating: number;
  role: string;
  ratings: Rating[];
};

export default function ProfilePage() {
  const { userId } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const BASE_URL = 'https://880292e0-c3fc-4e31-b50c-c0d805539c08-00-2ygnkil1bylzo.pike.replit.dev';

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${BASE_URL}/users/${userId}`);
        if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
        const userData = await res.json();
        setUser(userData);
        setSelectedUser(userData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchUser();
  }, [userId]);

  const handleSubmitSwapRequest = async (requestData: any) => {
    // Handle swap request submission
    console.log('Swap request submitted:', requestData);
    setShowRequestModal(false);
  };

  const handleRequestSwap = () => {
    setShowRequestModal(true);
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">Loading profile...</p>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <p className="text-red-600 text-xl font-medium">{error}</p>
              <p className="text-gray-500 mt-2">Please try again later</p>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {user && (
          <>
            {/* Hero Section */}
            <div className="mb-8">
              <Card className="bg-white/80 backdrop-blur-xl border border-gray-200 shadow-xl rounded-3xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 h-24"></div>
                <CardContent className="relative p-8">
                  {/* Profile Image */}
                  <div className="absolute -top-12 left-8">
                    <div className="w-24 h-24 rounded-3xl border-4 border-white shadow-xl overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600">
                      {user.profile_url ? (
                        <img 
                          src={user.profile_url} 
                          alt={user.fullname}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold">
                          {user.fullname.charAt(0)}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="ml-36 flex justify-between items-start">
                    <div className="flex-1">
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.fullname}</h1>
                      <p className="text-gray-600 text-lg mb-1">@{user.username}</p>
                      <div className="flex items-center text-gray-500 mb-3">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>{user.address}</span>
                      </div>
                      <div className="flex items-center space-x-6 mb-4">
                        <div className="flex items-center">
                          <Star className="w-5 h-5 text-yellow-500 mr-1" />
                          <span className="text-gray-900 font-semibold">{user.rating}</span>
                          <span className="text-gray-500 ml-1">rating</span>
                        </div>
                        <div className="flex items-center">
                          <Trophy className="w-5 h-5 text-orange-500 mr-1" />
                          <span className="text-gray-900 font-semibold">{user.ratings.length}</span>
                          <span className="text-gray-500 ml-1">reviews</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-3">
                      <Button 
                        onClick={handleRequestSwap}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <Zap className="w-5 h-5 mr-2" />
                        Request Swap
                      </Button>
                      <Button 
                        variant="outline" 
                        className="border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100 px-6 py-3 rounded-xl"
                      >
                        <MessageSquare className="w-5 h-5 mr-2" />
                        Message
                      </Button>
                      <Button 
                        variant="outline" 
                        className="border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100 px-4 py-3 rounded-xl"
                      >
                        <Share2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[
                { 
                  title: 'Overall Rating', 
                  value: `${user.rating}★`, 
                  change: `From ${user.ratings.length} reviews`,
                  icon: Star, 
                  bgGradient: 'from-yellow-50 to-orange-100',
                  iconBg: 'bg-yellow-500'
                },
                { 
                  title: 'Profile Views', 
                  value: '2.5K', 
                  change: '+12% this week',
                  icon: Eye, 
                  bgGradient: 'from-blue-50 to-blue-100',
                  iconBg: 'bg-blue-500'
                },
                {
                  title: 'Skills Offered',
                  value: user.skills_offered.length.toString(),
                  change: 'Active skills',
                  icon: UserCheck,
                  bgGradient: 'from-emerald-50 to-emerald-100',
                  iconBg: 'bg-emerald-500'
                },
                {
                  title: 'Skills Wanted',
                  value: user.skills_wanted.length.toString(),
                  change: 'Learning goals',
                  icon: Award,
                  bgGradient: 'from-purple-50 to-purple-100',
                  iconBg: 'bg-purple-500'
                },
              ].map((stat, index) => (
                <Card key={index} className={`bg-gradient-to-br ${stat.bgGradient} border-0 hover:shadow-xl transition-all duration-300 transform hover:scale-105 shadow-lg rounded-2xl`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                      <div className={`w-12 h-12 ${stat.iconBg} rounded-2xl flex items-center justify-center shadow-lg`}>
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="flex items-center text-sm">
                      <TrendingUp className="w-4 h-4 text-emerald-600 mr-1" />
                      <span className="text-emerald-600 font-medium">{stat.change}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Skills Section */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="bg-white/80 backdrop-blur-xl border border-gray-200 shadow-xl rounded-3xl">
                  <CardHeader className="flex flex-row items-center justify-between pb-4">
                    <CardTitle className="text-gray-900 text-xl font-bold flex items-center">
                      <div className="w-8 h-8 rounded-2xl bg-emerald-500 flex items-center justify-center mr-3">
                        <UserCheck className="w-4 h-4 text-white" />
                      </div>
                      Skills I Offer
                    </CardTitle>
                    {/* <Button size="sm" variant="outline" className="bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 rounded-xl">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Skill
                    </Button> */}
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-3">
                      {user.skills_offered.map((skill, i) => (
                        <span 
                          key={i} 
                          className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-medium border border-emerald-200 hover:border-emerald-300 transition-all duration-200"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 backdrop-blur-xl border border-gray-200 shadow-xl rounded-3xl">
                  <CardHeader className="flex flex-row items-center justify-between pb-4">
                    <CardTitle className="text-gray-900 text-xl font-bold flex items-center">
                      <div className="w-8 h-8 rounded-2xl bg-purple-500 flex items-center justify-center mr-3">
                        <Award className="w-4 h-4 text-white" />
                      </div>
                      Skills I Want to Learn
                    </CardTitle>
                    {/* <Button size="sm" variant="outline" className="bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 rounded-xl">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Goal
                    </Button> */}
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-3">
                      {user.skills_wanted.map((skill, i) => (
                        <span 
                          key={i} 
                          className="px-4 py-2 bg-purple-50 text-purple-700 rounded-xl text-sm font-medium border border-purple-200 hover:border-purple-300 transition-all duration-200"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Quick Actions */}
                {/* <Card className="bg-white/80 backdrop-blur-xl border border-gray-200 shadow-xl rounded-3xl">
                  <CardHeader>
                    <CardTitle className="text-gray-900 text-lg font-bold flex items-center">
                      <Zap className="w-5 h-5 mr-2 text-blue-600" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      onClick={handleRequestSwap}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg border-0 rounded-xl"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Request Skill Swap
                    </Button>
                    <Button variant="outline" className="w-full bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 rounded-xl">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                    <Button variant="outline" className="w-full bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 rounded-xl">
                      <Heart className="w-4 h-4 mr-2" />
                      Add to Favorites
                    </Button>
                  </CardContent>
                </Card> */}

                {/* Availability */}
                <Card className="bg-white/80 backdrop-blur-xl border border-gray-200 shadow-xl rounded-3xl">
                  <CardHeader>
                    <CardTitle className="text-gray-900 text-lg font-bold flex items-center">
                      <Calendar className="w-5 h-5 mr-2 text-orange-600" />
                      Availability
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm font-semibold text-emerald-900">Available</div>
                          <Clock className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div className="text-xs text-emerald-600">{user.availability}</div>
                      </div>
                      {/* <div className="text-sm text-gray-600">
                        <div className="flex items-center justify-between py-2">
                          <span>Response Time</span>
                          <span className="font-medium text-gray-900">~2 hours</span>
                        </div>
                        <div className="flex items-center justify-between py-2">
                          <span>Active Swaps</span>
                          <span className="font-medium text-gray-900">3</span>
                        </div>
                      </div> */}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="mt-8">
              <Card className="bg-white/80 backdrop-blur-xl border border-gray-200 shadow-xl rounded-3xl">
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                  <CardTitle className="text-gray-900 text-xl font-bold flex items-center">
                    <div className="w-8 h-8 rounded-2xl bg-yellow-500 flex items-center justify-center mr-3">
                      <Star className="w-4 h-4 text-white" />
                    </div>
                    Reviews & Feedback
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <div className="text-sm text-gray-600">
                      <span className="font-semibold text-gray-900">{user.rating}</span> out of 5 stars
                    </div>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < Math.floor(user.rating) ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {user.ratings.length === 0 ? (
                    <div className="text-center py-12">
                      <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 text-lg font-medium">No reviews yet</p>
                      <p className="text-gray-500 text-sm mt-1">Be the first to leave a review after a skill swap!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {user.ratings.map((rating, i) => (
                        <div key={i} className="p-6 bg-gray-50/80 rounded-2xl border border-gray-200/50 hover:bg-gray-100/80 transition-all duration-200">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <div className="flex">
                                {[...Array(5)].map((_, starIndex) => (
                                  <Star
                                    key={starIndex}
                                    className={`w-4 h-4 ${
                                      starIndex < rating.score
                                        ? 'text-yellow-500 fill-current'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-gray-900 font-semibold">{rating.score}/5</span>
                            </div>
                            <div className="flex items-center text-gray-500 text-sm">
                              <Clock className="w-4 h-4 mr-1" />
                              {new Date(rating.rated_at).toLocaleDateString()}
                            </div>
                          </div>
                          <p className="text-gray-700 leading-relaxed">{rating.feedback}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* Request Swap Modal */}
        {/* {selectedUser && (
          <RequestSwapModal 
            isOpen={showRequestModal} 
            onClose={() => setShowRequestModal(false)}
            targetUser={selectedUser}
            currentUser={authService.getCurrentUser()}
            onSubmit={handleSubmitSwapRequest}
          />
        )} */}
      </div>
    </AppLayout>
  );
}