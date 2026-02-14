Table,Column(s),Index Type,Purpose,User,"username, email",Unique Index,Ensures O(1) lookup speed and
enforces data uniqueness.
Post,createdAt,B-Tree Index,"Critical for sorting the /api/feed and activity history by ""newest first"" efficiently."
Hashtag,name,Unique Index,Optimized for case-insensitive matching in the /api/posts/hashtag/:tag endpoint.
Join Tables,"followerId, followingId",Composite Index,"Optimizes the ""personalized feed"" query by quickly identifying all followed IDs."