import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { supabase } from '../lib/supabase';
import { useAuth } from '../AuthContext';

type Post = {
  id: string;
  content: string;
  username: string;
  created_at: string;
};

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();

  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) setPosts(data as Post[]);
  };

  const handlePost = async () => {
    if (!user) {
      setMessage('❌ You must be logged in');
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      setMessage('❌ Could not find user profile');
      return;
    }

    const { error } = await supabase.from('posts').insert({
      content,
      user_id: user.id,
      username: profile.username,
    });

    if (error) {
      setMessage('❌ Failed to post');
    } else {
      setContent('');
      setMessage('✅ Post created!');
      fetchPosts();
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        value={content}
        onChangeText={setContent}
        placeholder="What's happening?"
        placeholderTextColor="#888"
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handlePost}>
        <Text style={styles.buttonText}>Post</Text>
      </TouchableOpacity>

      <Text style={styles.status}>{message}</Text>

      <ScrollView>
        {posts.map((post) => (
          <TouchableOpacity
            key={post.id}
            onPress={() => router.push(`/user/${post.username}`)}
            style={styles.card}
          >
            <Text style={styles.username}>@{post.username}</Text>
            <Text style={styles.post}>{post.content}</Text>
            <Text style={styles.timestamp}>
              {new Date(post.created_at).toLocaleString()}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#061e45',
    padding: 16,
  },
  input: {
    backgroundColor: '#1a2b4c',
    color: 'white',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#7814db',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  status: {
    color: 'white',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#2a3b5c',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  username: {
    color: '#7814db',
    fontWeight: 'bold',
  },
  post: {
    color: 'white',
    marginTop: 4,
  },
  timestamp: {
    color: '#aaa',
    fontSize: 12,
    marginTop: 4,
  },
});
