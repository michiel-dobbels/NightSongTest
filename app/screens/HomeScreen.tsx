import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../AuthContext';

type Post = {
  id: string;
  user_id: string;
  content: string;
  username: string;
  user_id: string;

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
      .select(
        `id, content, user_id, created_at, profiles (username, display_name)`
      )
      .order('created_at', { ascending: false });

    if (!error && data) setPosts(data);

  };

  const handlePost = async () => {
    if (!postText.trim()) return;
    if (!user || !profile) return;

    const tempPost: Post = {
      id: `temp-${Date.now()}`,
      content: postText,
      user_id: user.id,
      username: profile.display_name || profile.username,
      created_at: new Date().toISOString(),
    };

    setPosts([tempPost, ...posts]);

    setPostText('');

    const { data, error } = await supabase
      .from('posts')

      .insert({
        content: tempPost.content,
        user_id: tempPost.user_id,
        username: tempPost.username,
      })
      .select('*')
      .single();

    if (error || !data) {
      // remove temp post on failure
      setPosts((current) => current.filter((p) => p.id !== tempPost.id));
      return;
    }

    setPosts((current) =>
      current.map((p) => (p.id === tempPost.id ? data : p))
    );

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
