# Mental Health AI Website - Admin System Setup

This guide will help you set up the complete admin dashboard system for the Mental Health AI website.

## 🎯 Overview

The admin system provides comprehensive management capabilities including:
- User management and analytics
- Blog post creation and management  
- Chat logs monitoring
- System analytics and reporting
- Security settings and configuration

## 🔧 Prerequisites

Before setting up the admin system, ensure you have:

1. **Supabase Project**: Set up and configured with authentication
2. **Database Access**: Admin access to your Supabase database
3. **Environment Variables**: Properly configured Supabase credentials

## 📊 Database Setup

### 1. Run Database Schema

Execute the SQL commands in `admin/database-setup.sql` in your Supabase SQL editor:

```bash
# Navigate to your Supabase project dashboard
# Go to SQL Editor
# Copy and paste the contents of admin/database-setup.sql
# Execute the script
```

This will create:
- `blog_posts` table for blog management
- `chat_messages` table for chat logging
- `analytics` table for tracking
- `system_settings` table for configuration
- Updated `user_profiles` table with admin roles
- All necessary Row Level Security policies

### 2. Create First Admin User

1. **Register a normal user** through the website signup process
2. **Promote to admin** by running this SQL command in Supabase:

```sql
SELECT promote_to_admin('your-admin-email@domain.com');
```

Replace `your-admin-email@domain.com` with the email of the user you want to make admin.

## 🚀 File Structure

The admin system consists of:

```
admin/
├── dashboard.html          # Admin dashboard interface
├── admin-dashboard.js      # Dashboard functionality
├── database-setup.sql      # Database schema and setup
└── README-admin-setup.md   # This setup guide

Updated files:
├── js/auth.js             # Enhanced with admin authentication
└── auth/login.html        # Supports admin redirects
```

## 🔐 Admin Authentication

### Login Process

1. Admin users login through the normal login page: `/auth/login.html`
2. The system automatically detects admin role and redirects to `/admin/dashboard.html`
3. For direct admin access, use: `/auth/login.html?redirect=admin`

### Security Features

- Role-based access control
- Row Level Security (RLS) on all tables
- Admin-only dashboard access
- Secure session management

## 📝 Admin Dashboard Features

### 1. Dashboard Overview
- User statistics and growth charts
- Chat activity monitoring
- Blog performance metrics
- Recent activity feed

### 2. User Management
- View all registered users
- Search and filter users
- User activity monitoring
- User account management

### 3. Blog Management
- Create new blog posts with rich editor
- Edit existing posts
- Publish/unpublish posts
- SEO optimization fields
- Featured image support

### 4. Chat Logs
- Monitor all chat interactions
- View user conversations
- Analytics on chat usage
- Response time tracking

### 5. Analytics
- User growth charts
- Popular content analysis
- System usage statistics
- Interactive data visualization

### 6. Settings
- General site configuration
- Security settings
- Admin account management
- System maintenance options

## 🎨 Blog Post Management

### Creating New Posts

1. Navigate to **Blog Management** section
2. Click **"নতুন পোস্ট তৈরি করুন"** (Create New Post)
3. Fill in the required fields:
   - **Title**: Post title in Bengali
   - **Slug**: Auto-generated URL slug
   - **Category**: Select appropriate category
   - **Status**: Draft or Published
   - **Read Time**: Estimated reading time
   - **Excerpt**: Short description
   - **Featured Image**: Optional image URL
   - **Content**: Full post content with HTML support

### Editing Posts

1. In the blog table, click **"সম্পাদনা"** (Edit) for any post
2. Modify the content in the modal
3. Save changes

### Publishing

- Set status to **"published"** to make posts live
- Use **"draft"** for unpublished content

## 📊 Analytics and Monitoring

### User Analytics
- Track user registrations
- Monitor active users
- Analyze user engagement

### Chat Analytics
- Total chat sessions
- Average response times
- User satisfaction metrics

### Content Analytics
- Most popular blog posts
- Page view statistics
- User interaction data

## 🔧 Configuration

### Environment Variables

Ensure these are set in your Supabase project:

```javascript
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

### System Settings

Admin can configure:
- Site name and branding
- Contact information
- Daily chat limits
- Maintenance mode
- Registration settings

## 🛡️ Security Considerations

### Database Security
- Row Level Security enabled on all tables
- Admin-only access to sensitive data
- Secure user role management

### Admin Access
- Only verified admin users can access dashboard
- Session timeout for security
- Audit logs for admin actions

## 🚨 Troubleshooting

### Common Issues

1. **"Access Denied" Error**
   - Ensure user has admin role in database
   - Check RLS policies are correctly applied

2. **Dashboard Not Loading**
   - Verify Supabase configuration
   - Check browser console for errors
   - Ensure all database tables exist

3. **Blog Posts Not Saving**
   - Check user permissions
   - Verify blog_posts table exists
   - Check for validation errors

### Debug Steps

1. **Check Browser Console**: Look for JavaScript errors
2. **Verify Database**: Ensure all tables and policies exist
3. **Test Authentication**: Confirm user login and admin role
4. **Check Network**: Verify Supabase connection

## 📱 Mobile Responsiveness

The admin dashboard is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- All modern browsers

## 🔄 Updates and Maintenance

### Regular Tasks
- Monitor system analytics
- Review chat logs
- Update blog content
- Manage user accounts
- Security updates

### Backup Recommendations
- Regular database backups
- Export blog content
- Save admin configurations

## 📞 Support

For issues with the admin system:

1. Check this documentation
2. Review browser console errors
3. Verify database configuration
4. Check Supabase project settings

## 🎉 Getting Started

1. **Setup Database**: Run the SQL setup script
2. **Create Admin**: Promote your first admin user
3. **Login**: Access the admin dashboard
4. **Configure**: Set up system settings
5. **Create Content**: Start adding blog posts
6. **Monitor**: Use analytics to track performance

The admin system is now ready for managing your Mental Health AI website! 🧠✨
