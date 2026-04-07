// src/components/Header.js
import React, { useState } from 'react';
import { Icons } from './Icons';

/* ── Avatar colour options ── */
const AVATAR_COLORS = [
  { id: 'blue',   grad: 'linear-gradient(135deg,#4f8eff,#9b6fff)' },
  { id: 'teal',   grad: 'linear-gradient(135deg,#2ddbb4,#4f8eff)' },
  { id: 'rose',   grad: 'linear-gradient(135deg,#ff5f7e,#9b6fff)' },
  { id: 'amber',  grad: 'linear-gradient(135deg,#f5a623,#ff5f7e)' },
  { id: 'green',  grad: 'linear-gradient(135deg,#3ddc84,#2ddbb4)' },
  { id: 'purple', grad: 'linear-gradient(135deg,#9b6fff,#ff5f7e)' },
];

/* ── Generate initials from full name ── */
const getInitials = (name) => {
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

/* ── Edit Profile Modal ── */
const EditProfileModal = ({ profile, onSave, onClose }) => {
  const [form, setForm] = useState({ ...profile });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = () => {
    if (!form.name.trim()) return;
    onSave(form);
    onClose();
  };

  const initials = getInitials(form.name);
  const avatarGrad = AVATAR_COLORS.find(c => c.id === form.avatarColor)?.grad
    || AVATAR_COLORS[0].grad;

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ width: 460 }}>
        <div className="modal-title">Edit Profile</div>

        {/* Live avatar preview */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          <div
            style={{
              width: 72, height: 72,
              borderRadius: '50%',
              background: avatarGrad,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-display)',
              fontSize: 26, fontWeight: 800,
              color: '#fff',
              boxShadow: '0 0 28px rgba(79,142,255,0.35)',
              letterSpacing: '-1px',
            }}
          >
            {initials}
          </div>
        </div>

        {/* Name */}
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input
            className="form-input"
            placeholder="e.g. Alex Chen"
            value={form.name}
            onChange={e => set('name', e.target.value)}
          />
        </div>

        {/* Semester / role line */}
        <div className="form-group">
          <label className="form-label">Semester / Year / Role</label>
          <input
            className="form-input"
            placeholder="e.g. Semester 6  /  Year 3  /  CS Major"
            value={form.semester}
            onChange={e => set('semester', e.target.value)}
          />
        </div>

        {/* University / institution */}
        <div className="form-group">
          <label className="form-label">Institution (optional)</label>
          <input
            className="form-input"
            placeholder="e.g. MIT  /  Stanford  /  IIT Madras"
            value={form.institution}
            onChange={e => set('institution', e.target.value)}
          />
        </div>

        {/* Avatar colour picker */}
        <div className="form-group">
          <label className="form-label">Avatar Colour</label>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 4 }}>
            {AVATAR_COLORS.map(c => (
              <div
                key={c.id}
                onClick={() => set('avatarColor', c.id)}
                style={{
                  width: 32, height: 32,
                  borderRadius: '50%',
                  background: c.grad,
                  cursor: 'pointer',
                  border: form.avatarColor === c.id
                    ? '3px solid #fff'
                    : '3px solid transparent',
                  boxShadow: form.avatarColor === c.id
                    ? '0 0 0 2px var(--accent-blue)'
                    : 'none',
                  transform: form.avatarColor === c.id ? 'scale(1.15)' : 'scale(1)',
                  transition: 'all 0.18s',
                }}
              />
            ))}
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave}>Save Profile</button>
        </div>
      </div>
    </div>
  );
};

/* ── Header component ── */
const Header = ({ activePage, searchQuery, setSearchQuery, profile, onProfileSave }) => {
  const [showEditProfile, setShowEditProfile] = useState(false);

  const pageTitles = {
    dashboard: 'Study Hub',
    subjects:  'All Subjects',
    tasks:     'My Tasks',
    planner:   'Weekly Planner',
  };

  const now = new Date();
  const dayName   = now.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
  const monthYear = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase();

  const initials   = getInitials(profile.name);
  const avatarGrad = AVATAR_COLORS.find(c => c.id === profile.avatarColor)?.grad
    || AVATAR_COLORS[0].grad;

  return (
    <>
      <header className="header">
        {/* Title */}
        <div className="header-title-block">
          <div className="header-eyebrow">// {dayName} · {monthYear}</div>
          <div className="header-title">{pageTitles[activePage] || 'Study Hub'}</div>
        </div>

        {/* Search */}
        <div className="header-search">
          <Icons.Search />
          <input
            type="text"
            placeholder="Search subjects, notes, tasks..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Profile — click to edit */}
        <div
          className="header-profile"
          onClick={() => setShowEditProfile(true)}
          title="Click to edit profile"
          style={{ cursor: 'pointer' }}
        >
          <div className="profile-info">
            <div className="profile-name">{profile.name}</div>
            <div className="profile-sub">
              {profile.semester}
              {profile.institution ? ` · ${profile.institution}` : ''}
            </div>
          </div>
          <div className="avatar" style={{ background: avatarGrad }}>
            {initials}
          </div>
        </div>
      </header>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <EditProfileModal
          profile={profile}
          onSave={onProfileSave}
          onClose={() => setShowEditProfile(false)}
        />
      )}
    </>
  );
};

export default Header;