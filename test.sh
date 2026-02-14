#!/bin/bash

# Base URLs
USERS_URL="http://localhost:3000/api/users"
POSTS_URL="http://localhost:3000/api/posts"
FEED_URL="http://localhost:3000/api/feed"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print section headers
print_header() {
    echo -e "\n${GREEN}=== $1 ===${NC}"
}

# Function to make API requests
make_request() {
    local method=$1
    local endpoint=$2
    local data=$3
    
    echo "Request: $method $endpoint"
    if [ -n "$data" ]; then
        echo "Data: $data"
    fi
    
    if [ "$method" = "GET" ]; then
        curl -s -X $method "$endpoint" 
    else
        curl -s -X $method "$endpoint" -H "Content-Type: application/json" -d "$data" 
    fi
    echo ""
}

# --- User & Social Functions ---

test_create_user() {
    print_header "Testing POST create user"
    read -p "Enter username: " username
    read -p "Enter first name: " firstName
    read -p "Enter last name: " lastName
    read -p "Enter email: " email
    local user_data="{\"username\": \"$username\", \"firstName\": \"$firstName\", \"lastName\": \"$lastName\", \"email\": \"$email\"}"
    make_request "POST" "$USERS_URL" "$user_data"
}

test_follow_user() {
    print_header "Testing POST follow user"
    read -p "Enter your user ID (follower): " followerId
    read -p "Enter target user ID to follow: " targetId
    local data="{\"followerId\": $followerId}"
    make_request "POST" "$USERS_URL/$targetId/follow" "$data"
}

test_get_followers() {
    print_header "Testing GET user followers"
    read -p "Enter user ID: " userId
    make_request "GET" "$USERS_URL/$userId/followers"
}

test_get_activity() {
    print_header "Testing GET user activity history"
    read -p "Enter user ID: " userId
    make_request "GET" "$USERS_URL/$userId/activity"
}
# --- Post & Content Functions ---

test_create_post() {
    print_header "Testing POST create post"
    read -p "Enter author user ID: " userId
    read -p "Enter content (e.g., Hello #world): " content
    local data="{\"userId\": $userId, \"content\": \"$content\"}"
    make_request "POST" "$POSTS_URL" "$data"
}

test_like_post() {
    print_header "Testing POST like post"
    read -p "Enter post ID: " postId
    read -p "Enter user ID (who likes): " userId
    local data="{\"userId\": $userId}"
    make_request "POST" "$POSTS_URL/$postId/like" "$data"
}

test_get_feed() {
    print_header "Testing GET personalized feed"
    read -p "Enter user ID: " userId
    make_request "GET" "$FEED_URL?userId=$userId"
}

test_get_hashtag() {
    print_header "Testing GET posts by hashtag"
    read -p "Enter tag (no #): " tag
    make_request "GET" "$POSTS_URL/hashtag/$tag"
}

# --- Menus ---

show_users_menu() {
    echo -e "\n${GREEN}Users & Social Menu${NC}"
    echo "1. Get all users"
    echo "2. Create new user"
    echo "3. Follow a user"
    echo "4. View followers (/api/users/:id/followers)"
    echo "5. View activity history (/api/users/:id/activity)"
    echo "6. Back to main menu"
    echo -n "Enter choice: "
}

show_posts_menu() {
    echo -e "\n${GREEN}Posts & Feed Menu${NC}"
    echo "1. Create Post (with #tags)"
    echo "2. Like/Unlike a Post"
    echo "3. View personalized feed (/api/feed)"
    echo "4. Find posts by hashtag (/api/posts/hashtag/:tag)"
    echo "5. Back to main menu"
    echo -n "Enter choice: "
}

show_main_menu() {
    echo -e "\n${GREEN}Social Media API Testing Suite${NC}"
    echo "1. Users & Social Operations"
    echo "2. Posts & Content Operations"
    echo "3. Exit"
    echo -n "Enter your choice (1-3): "
}
# --- Main Loop ---
while true; do
    show_main_menu
    read choice
    case $choice in
        1)
            while true; do
                show_users_menu
                read u_choice
                case $u_choice in
                    1) make_request "GET" "$USERS_URL" ;;
                    2) test_create_user ;;
                    3) test_follow_user ;;
                    4) test_get_followers ;;
                    5) test_get_activity ;;
                    6) break ;;
                esac
            done ;;
        2)
            while true; do
                show_posts_menu
                read p_choice
                case $p_choice in
                    1) test_create_post ;;
                    2) test_like_post ;;
                    3) test_get_feed ;;
                    4) test_get_hashtag ;;
                    5) break ;;
                esac
            done ;;
        3) echo "Exiting..."; exit 0 ;;
        *) echo "Invalid choice." ;;
    esac
done