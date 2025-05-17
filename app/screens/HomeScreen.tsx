import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../AuthContext';

type Post = {
  id: string;
  content: string;
  username: string;
  created_at: string;
};

export default function HomeScreen() {
  const { session, profile } = useAuth(); // assuming profile contains username
  const [postText, setPostText] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);


  

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) setPosts(data);
  };

  const handlePost = async () => {
    if (!postText.trim()) return;

    const user = session?.user;
    if (!user) return;

    const { error } = await supabase.from('posts').insert([
      {
        content: postText,
        user_id: user.id,
        username: profile.display_name || profile.username,
      },
    ]);

    if (!error) {
      setPostText('');
      fetchPosts(); // refresh feed
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
            <Text style={styles.timestamp}>{new Date(item.created_at).toLocaleString()}</Text>
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
