import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../AuthContext';

type Post = {
  id: string;
  user_id: string;
  content: string;
  username: string;
  created_at: string;
};

function timeAgo(dateString: string): string {
  const diff = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function HomeScreen() {
  const { user, profile } = useAuth();
  const [postText, setPostText] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);


  

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) setPosts(data as Post[]);
  };

  const handlePost = async () => {
    const text = postText.trim();
    if (!text) return;
    if (!user) return;

    const username = profile.display_name || profile.username;
    const tempPost: Post = {
      id: `temp-${Date.now()}`,
      user_id: user.id,
      content: text,
      username,
      created_at: new Date().toISOString(),
    };

    // Optimistically update the feed
    setPosts([tempPost, ...posts]);
    setPostText('');

    const { data, error } = await supabase
      .from('posts')
      .insert([
        {
          content: text,
          user_id: user.id,
          username,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Failed to create post:', error);
      setPosts((prev) => prev.filter((p) => p.id !== tempPost.id));
    } else if (data) {
      setPosts((prev) =>
        prev.map((p) => (p.id === tempPost.id ? (data as Post) : p)),
      );
      // Ensure the feed stays in sync
      fetchPosts();
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    
    <View style={styles.container}>
      <TextInput
        placeholder="What's happening?"
        value={postText}
        onChangeText={setPostText}
        style={styles.input}
        multiline
      />
      <Button title="Post" onPress={handlePost} />
      
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.post}>
            <Text style={styles.username}>@{item.username}</Text>
            <Text>{item.content}</Text>
            <Text style={styles.timestamp}>{timeAgo(item.created_at)}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#061e45' },
  input: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  post: {
    backgroundColor: '#ffffff10',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
  username: { fontWeight: 'bold', color: 'white' },
  timestamp: { fontSize: 10, color: 'gray' },
});
