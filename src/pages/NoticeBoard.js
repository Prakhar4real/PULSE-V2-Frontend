import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/NoticeBoard.css';

const NoticeBoard = () => {
    const [notices, setNotices] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isPinned, setIsPinned] = useState(false);
    const [loading, setLoading] = useState(true);

    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('access');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            
            
            const noticeRes = await axios.get('http://127.0.0.1:8000/api/notices/', config);
            setNotices(noticeRes.data);

            
            try {
                const userRes = await axios.get('http://127.0.0.1:8000/api/user/profile/', config);
                if (userRes.data.is_staff) {
                    setIsAdmin(true);
                }
            } catch (err) {
                
                setIsAdmin(false);
            }

            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setLoading(false);
        }
    };

    const handlePost = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('access');
            await axios.post('http://127.0.0.1:8000/api/notices/', {
                title,
                content,
                is_pinned: isPinned
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            
            setTitle('');
            setContent('');
            setIsPinned(false);
            
            
            const res = await axios.get('http://127.0.0.1:8000/api/notices/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotices(res.data);
            
        } catch (error) {
            console.error("Error posting notice:", error);
            alert("Failed to post notice. Only Admins can do this!");
        }
    };

    return (
        <div className="notice-container">
            <div className="notice-header">
                <h1>Community Bulletin</h1>
            </div>

            {isAdmin && (
                <form className="create-notice-form" onSubmit={handlePost}>
                    <h3>Post a Notice (Admin Only)</h3>
                    <input 
                        type="text" 
                        placeholder="Title (e.g., Road Closure Alert)" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required 
                    />
                    <textarea 
                        placeholder="Write your announcement here..." 
                        rows="3"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    ></textarea>
                    
                    <div className="pin-checkbox">
                        <input 
                            type="checkbox" 
                            id="pin" 
                            checked={isPinned}
                            onChange={(e) => setIsPinned(e.target.checked)} 
                        />
                        <label htmlFor="pin">PIN (Important)</label>
                    </div>

                    <button type="submit" className="post-btn">Post Notice</button>
                </form>
            )}

            
            {loading ? <p>Loading updates...</p> : (
                <div className="notice-list">
                    {notices.map((notice) => (
                        <div key={notice.id} className={`notice-card ${notice.is_pinned ? 'pinned' : ''}`}>
                            {notice.is_pinned && <span className="pin-icon">📌</span>}
                            <h2 className="notice-title">{notice.title}</h2>
                            <span className="notice-meta">
                                By <strong>{notice.author_name}</strong> • {new Date(notice.created_at).toLocaleDateString()} 
                            </span>
                            <p className="notice-content">{notice.content}</p>
                        </div>
                    ))}
                    
                    {notices.length === 0 && <p style={{textAlign: 'center', color: '#666'}}>No notices yet.</p>}
                </div>
            )}
        </div>
    );
};

export default NoticeBoard;