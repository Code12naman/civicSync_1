"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Edit, Save, KeyRound, User, Mail, ListChecks, Star, CheckCircle, MessageSquare, Camera, Phone, MapPin, Settings, Activity, Info, LoaderCircle } from "lucide-react"; // Added Info, LoaderCircle, Save
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, animate, AnimatePresence } from 'framer-motion';
import { formatDistanceToNowStrict } from 'date-fns'; // Import date-fns function
import { getUserProfile, setUserProfile, createDefaultProfile, UserProfile } from "@/lib/mock-users";

// Mock Activity Data
const mockActivities = [
  {
    id: 'act1',
    type: 'report',
    title: 'Large Pothole on Main St',
    status: 'Pending',
    timestamp: new Date(2024, 6, 15, 10, 30),
  },
  {
    id: 'act2',
    type: 'resolve',
    title: 'Overflowing Bin',
    status: 'Resolved',
    timestamp: new Date(2024, 6, 12, 15, 0),
  },
  {
    id: 'act3',
    type: 'comment',
    title: 'Streetlight Out',
    comment: 'Any updates on this? It\'s still dark.',
    timestamp: new Date(2024, 6, 10, 9, 0),
  },
   {
    id: 'act4',
    type: 'report',
    title: 'Broken Park Bench',
    status: 'In Progress',
    timestamp: new Date(2024, 6, 8, 14, 15),
  },
  {
    id: 'act5',
    type: 'update', // Simulate an update from admin side
    title: 'Broken Park Bench',
    update: 'Assigned to parks department. Status changed to In Progress.',
    timestamp: new Date(2024, 6, 9, 11, 0),
  },
].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()); // Sort by newest first

const getInitials = (name: string | null | undefined): string => {
    if (!name) return "?";
    const names = name.trim().split(' ');
    if (names.length === 1) return names[0][0]?.toUpperCase() ?? "?";
    return (names[0][0] + (names[names.length - 1][0] || '')).toUpperCase();
};

const ActivityIcon = ({ type, status }: { type: string; status?: string }) => {
  const className = "h-5 w-5 mt-1";
  switch (type) {
    case 'report':
      return <ListChecks className={`${className} text-primary`} />;
    case 'resolve':
      return <CheckCircle className={`${className} text-accent`} />;
    case 'comment':
      return <MessageSquare className={`${className} text-muted-foreground`} />;
    case 'update':
        if (status === 'In Progress') return <LoaderCircle className={`${className} text-primary animate-spin`} />;
        return <Info className={`${className} text-blue-500`} />; // Generic update icon
    default:
      return <Activity className={`${className} text-muted-foreground`} />;
  }
};

export default function CitizenProfilePage() {
    // Simulate getting the logged-in user's email (in real app, get from auth/session)
    const [userEmail, setUserEmail] = useState<string | null>(null);
    useEffect(() => {
        // Try to get from localStorage (set on login)
        const email = typeof window !== 'undefined' ? localStorage.getItem('citizenUserEmail') : null;
        setUserEmail(email);
    }, []);

    // Load profile for the logged-in user
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoadingProfile, setIsLoadingProfile] = useState(true);
    useEffect(() => {
        if (userEmail) {
            let loaded = getUserProfile(userEmail);
            // If profile doesn't exist, create a default one
            if (!loaded) {
                loaded = createDefaultProfile(userEmail, 'citizen');
                setUserProfile(userEmail, loaded);
            }
            setProfile({ ...loaded });
            setIsLoadingProfile(false);
        }
    }, [userEmail]);

    // Editable fields
    const [isEditing, setIsEditing] = useState(false);
    const [displayName, setDisplayName] = useState("");
    const [phone, setPhone] = useState("");
    const [location, setLocation] = useState("");
    const [bio, setBio] = useState("");
    const { toast } = useToast();
    const [unsaved, setUnsaved] = useState(false);
    const [saving, setSaving] = useState(false);
    const saveTimer = useRef<number | null>(null);
    const nameInputRef = useRef<HTMLInputElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // Sync profile fields to state when loaded
    useEffect(() => {
        if (profile) {
            setDisplayName(profile.displayName || "");
            setPhone(profile.phone || "");
            setLocation(profile.location || "");
            setBio(profile.bio || "");
        }
    }, [profile]);

    // Compute profile completion percentage
    const completion = Math.round(((!!profile?.photoURL ? 1 : 0) + (displayName ? 1 : 0) + (phone ? 1 : 0) + (location ? 1 : 0) + (bio ? 1 : 0)) / 5 * 100);

    // Animated counters for stats
    const reportsMv = useMotionValue(profile?.reportsSubmitted ?? 0);
    const resolvedMv = useMotionValue(profile?.reportsResolved ?? 0);
    const commentsMv = useMotionValue(profile?.commentsMade ?? 0);
    const [reportsDisplay, setReportsDisplay] = useState(profile?.reportsSubmitted ?? 0);
    const [resolvedDisplay, setResolvedDisplay] = useState(profile?.reportsResolved ?? 0);
    const [commentsDisplay, setCommentsDisplay] = useState(profile?.commentsMade ?? 0);

    useEffect(() => {
            animate(reportsMv, profile?.reportsSubmitted ?? 0, { duration: 0.8, ease: 'easeOut', onUpdate: v => setReportsDisplay(Math.round(v)) });
            animate(resolvedMv, profile?.reportsResolved ?? 0, { duration: 0.8, ease: 'easeOut', onUpdate: v => setResolvedDisplay(Math.round(v)) });
            animate(commentsMv, profile?.commentsMade ?? 0, { duration: 0.8, ease: 'easeOut', onUpdate: v => setCommentsDisplay(Math.round(v)) });
    }, [profile]);

        // Autosave debounce: when fields change, auto-save after short delay
        useEffect(() => {
            if (!unsaved) return;
            if (saveTimer.current) window.clearTimeout(saveTimer.current);
            // Auto-save after 1.2s of inactivity
            saveTimer.current = window.setTimeout(() => {
                handleSave();
            }, 1200);
            return () => { if (saveTimer.current) window.clearTimeout(saveTimer.current); };
        }, [displayName, phone, location, bio]);

    const handleEditToggle = () => {
        if (isEditing) {
            // Save changes when toggling off edit
            handleSave();
        } else {
            setIsEditing(true);
            // focus name input quickly
            setTimeout(() => nameInputRef.current?.focus(), 120);
        }
    };

    const handleSave = async () => {
        if (!profile || !userEmail) return;
        setSaving(true);
        const updated: UserProfile = {
            ...profile,
            displayName,
            phone,
            location,
            bio,
        };
        // Simulate save delay
        await new Promise(r => setTimeout(r, 500));
        setUserProfile(userEmail, updated);
        setProfile(updated);
        setUnsaved(false);
        setIsEditing(false);
        setSaving(false);
        toast({ title: 'Profile saved', description: 'Your profile has been updated.' });
    };

    const handleChangePassword = () => {
        toast({ title: "Change Password", description: "Password change feature coming soon." });
    };

    const StatItem = ({ value, label }: { value: number | string; label: string }) => (
        <motion.div whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 250 }} className="text-center p-2">
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
        </motion.div>
    );

    if (!profile || isLoadingProfile) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="flex flex-col items-center gap-3">
                    <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative overflow-hidden rounded-lg p-8 bg-gradient-to-r from-blue-50/60 via-purple-50/40 to-emerald-50/60 border border-border/40"
            >
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent">My Profile</h1>
                        <p className="text-sm text-muted-foreground mt-1">Manage your account and track your community impact</p>
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Basic Info & Stats */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <Card className="lg:col-span-1 shadow-lg h-fit glass-card p-4 border-border/50 hover:border-border/80 transition-colors">
                    <CardHeader className="items-center text-center">
                        <div className="relative mb-4">
                            <div className="mx-auto w-28 h-28 rounded-full overflow-hidden relative">
                                <img src={profile.photoURL || `/api/avatar/${profile.email}`} alt={displayName || 'avatar'} className="w-full h-full object-cover rounded-full" />
                                <motion.button whileHover={{ scale: 1.05 }} onClick={() => fileInputRef.current?.click()} className="absolute bottom-2 right-2 bg-white/90 p-2 rounded-full shadow-lg">
                                    <Camera className="h-4 w-4 text-primary" />
                                </motion.button>
                                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
                                    const f = e.target.files?.[0];
                                    if (f && userEmail) {
                                        const url = URL.createObjectURL(f);
                                        const updated = { ...profile, photoURL: url } as UserProfile;
                                        setUserProfile(userEmail, updated);
                                        setProfile(updated);
                                        toast({ title: 'Avatar updated', description: 'Profile picture updated locally.' });
                                    }
                                }} />
                            </div>
                        </div>

                        <CardTitle className="text-2xl mt-3">{displayName || "User"}</CardTitle>
                        <CardDescription className="text-muted-foreground">{profile.email}</CardDescription>
                        <div className="flex flex-wrap justify-center gap-2 mt-2">
                            {(profile.badges || []).map((badge: string) => (
                                <Badge key={badge} variant={badge === "Top Reporter" ? "default" : "secondary"} className="flex items-center gap-1">
                                    {badge === "Active Member" && <CheckCircle className="h-3 w-3" />}
                                    {badge === "Top Reporter" && <Star className="h-3 w-3" />}
                                    {badge}
                                </Badge>
                            ))}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            Member since {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : ''}
                        </p>

                        <div className="mt-4 flex items-center justify-center gap-4">
                            <div className="progress-wrap">
                                <svg className="progress-svg" width="64" height="64" viewBox="0 0 36 36">
                                    <defs>
                                        <linearGradient id="pg" x1="0" x2="1"><stop offset="0" stopColor="#22c55e"/><stop offset="1" stopColor="#86efac"/></linearGradient>
                                    </defs>
                                    <circle cx="18" cy="18" r="15" fill="none" stroke="#eef3f8" strokeWidth="3" />
                                    <motion.circle cx="18" cy="18" r="15" fill="none" stroke="url(#pg)" strokeWidth="3" strokeDasharray="94" strokeDashoffset={Math.max(0, 94 - (94 * completion) / 100)} initial={{ strokeDashoffset: 94 }} animate={{ strokeDashoffset: Math.max(0, 94 - (94 * completion) / 100) }} transition={{ duration: 0.8 }} strokeLinecap="round" />
                                </svg>
                            </div>
                            <div>
                                <div className="text-sm text-muted-foreground">Profile</div>
                                <div className="text-lg font-semibold">{completion}% complete</div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="border-t pt-4">
                        <div className="flex justify-around">
                            <StatItem value={reportsDisplay} label="Reports" />
                            <StatItem value={resolvedDisplay} label="Resolved" />
                            <StatItem value={commentsDisplay} label="Comments" />
                        </div>
                    </CardContent>
                    </Card>
                </motion.div>

                {/* Right Column: Tabs */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="lg:col-span-2"
                >
                                        <Tabs defaultValue="personal-info">
                                                <div className="tabs-underline mb-6">
                                                    <TabsList className="grid w-full grid-cols-3 relative bg-gradient-to-r from-muted to-muted/50 p-1 rounded-lg border border-border/30 shadow-sm">
                                                        <TabsTrigger value="personal-info" className="transition-all data-[state=active]:bg-white data-[state=active]:shadow-md">
                                                            <User className="mr-2 h-4 w-4"/>Personal Info
                                                        </TabsTrigger>
                                                        <TabsTrigger value="activity" className="transition-all data-[state=active]:bg-white data-[state=active]:shadow-md">
                                                            <Activity className="mr-2 h-4 w-4"/>Activity
                                                        </TabsTrigger>
                                                        <TabsTrigger value="settings" className="transition-all data-[state=active]:bg-white data-[state=active]:shadow-md">
                                                            <Settings className="mr-2 h-4 w-4"/>Settings
                                                        </TabsTrigger>
                                                    </TabsList>
                                                </div>

                        {/* Personal Info Tab */}
                        <TabsContent value="personal-info">
                            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
                            <Card className="shadow-lg glass-card">
                                <CardHeader>
                                    <CardTitle>Personal Information</CardTitle>
                                    <CardDescription>Update your personal information and contact details.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-1">
                                        <Label htmlFor="displayName">Full Name</Label>
                                        <div className="relative">
                                          <Input
                                            id="displayName"
                                            ref={nameInputRef}
                                            value={displayName}
                                            onChange={(e) => { setDisplayName(e.target.value); setUnsaved(true); }}
                                            disabled={!isEditing}
                                            className={`disabled:opacity-70 disabled:cursor-not-allowed ${isEditing ? 'focus-glow' : ''}`}
                                          />
                                          <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                            {!isEditing ? (<Button size="sm" variant="ghost" onClick={() => { setIsEditing(true); setTimeout(()=>nameInputRef.current?.focus(), 80); }}><Edit className="h-4 w-4"/></Button>) : (<Button size="sm" onClick={handleSave} disabled={!unsaved || saving}><Save className="h-4 w-4"/></Button>)}
                                          </div>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input id="email" value={profile.email} disabled className="opacity-70 cursor-not-allowed" />
                                    </div>
                                     <div className="space-y-1">
                                        <Label htmlFor="phone">Phone Number</Label>
                                         <Input
                                            id="phone"
                                            value={phone}
                                            onChange={(e) => { setPhone(e.target.value); setUnsaved(true); }}
                                            disabled={!isEditing}
                                            className={`disabled:opacity-70 disabled:cursor-not-allowed ${isEditing ? 'focus-glow' : ''}`}
                                            placeholder="e.g., +91 98765 43210"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="location">Location</Label>
                                         <Input
                                            id="location"
                                            value={location}
                                            onChange={(e) => { setLocation(e.target.value); setUnsaved(true); }}
                                            disabled={!isEditing}
                                            className={`disabled:opacity-70 disabled:cursor-not-allowed ${isEditing ? 'focus-glow' : ''}`}
                                            placeholder="e.g., City, Country"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="bio">Bio</Label>
                                        <Textarea
                                            id="bio"
                                            value={bio}
                                            onChange={(e) => { setBio(e.target.value); setUnsaved(true); }}
                                            disabled={!isEditing}
                                            className="disabled:opacity-70 disabled:cursor-not-allowed min-h-[100px]"
                                            placeholder="Tell us a bit about yourself..."
                                        />
                                    </div>
                                </CardContent>
                                <CardFooter className="border-t pt-6 flex justify-end">
                                    <div className="autosave-tooltip">
                                      <Button onClick={handleEditToggle} variant={isEditing ? 'default' : 'secondary'}>
                                          {isEditing ? <Save className="mr-2 h-4 w-4" /> : <Edit className="mr-2 h-4 w-4" />}
                                          {isEditing ? (saving ? 'Saving...' : 'Save Changes') : 'Edit Profile'}
                                      </Button>
                                      <div className={`tip ${unsaved ? 'show' : ''}`}>{unsaved ? 'Unsaved changes' : 'All saved'}</div>
                                    </div>
                                </CardFooter>
                            </Card>
                            </motion.div>
                        </TabsContent>

                        {/* Activity Tab - Now with content */}
                         <TabsContent value="activity">
                            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
                            <Card className="shadow-lg glass-card">
                                <CardHeader>
                                    <CardTitle>Recent Activity</CardTitle>
                                    <CardDescription>Your recent reports, comments, and issue updates.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {mockActivities.length > 0 ? (
                                        <div className="space-y-4">
                                            {mockActivities.map((activity, index) => (
                                                <React.Fragment key={activity.id}>
                                                    <div className="flex items-start gap-3">
                                                        <ActivityIcon type={activity.type} status={activity.status} />
                                                        <div className="flex-1">
                                                            <p className="text-sm leading-snug">
                                                                {activity.type === 'report' && <>You reported <span className="font-medium">"{activity.title}"</span></>}
                                                                {activity.type === 'resolve' && <>Your report <span className="font-medium">"{activity.title}"</span> was resolved.</>}
                                                                {activity.type === 'comment' && <>You commented on <span className="font-medium">"{activity.title}"</span>: <em className="text-muted-foreground">"{activity.comment}"</em></>}
                                                                 {activity.type === 'update' && <>Update on <span className="font-medium">"{activity.title}"</span>: <span className="text-muted-foreground">{activity.update}</span></>}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground mt-0.5">
                                                                {formatDistanceToNowStrict(activity.timestamp, { addSuffix: true })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {index < mockActivities.length - 1 && <Separator />}
                                                </React.Fragment>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-muted-foreground text-center py-8">No recent activity found.</p>
                                    )}
                                </CardContent>
                            </Card>
                            </motion.div>
                         </TabsContent>

                        {/* Settings Tab */}
                        <TabsContent value="settings">
                            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
                            <Card className="shadow-lg glass-card">
                                <CardHeader>
                                    <CardTitle>Account Settings</CardTitle>
                                    <CardDescription>Manage your account security and preferences.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-3">
                                        <h3 className="text-base font-semibold">Security</h3>
                                        <Button variant="outline" onClick={handleChangePassword} className="w-full sm:w-auto">
                                            <KeyRound className="mr-2 h-4 w-4" /> Change Password
                                        </Button>
                                    </div>
                                     <Separator />
                                     <div className="space-y-3">
                                         <h3 className="text-base font-semibold">Preferences</h3>
                                         <p className="text-sm text-muted-foreground">Notification preferences will be available here.</p>
                                     </div>
                                </CardContent>
                            </Card>
                            </motion.div>
                        </TabsContent>
                    </Tabs>
                </motion.div>
            </div>
                        {/* Save FAB */}
                        <AnimatePresence>
                            {(isEditing || unsaved) && (
                                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }} transition={{ duration: 0.25 }} className="fixed bottom-8 right-8 z-50">
                                    <motion.button 
                                        whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)" }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleSave} 
                                        className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                                    >
                                        {saving ? (
                                            <>
                                                <LoaderCircle className="h-4 w-4 animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="h-4 w-4" />
                                                Save Changes
                                            </>
                                        )}
                                    </motion.button>
                                </motion.div>
                            )}
                        </AnimatePresence>
        </div>
    );
}
