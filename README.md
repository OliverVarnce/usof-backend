# usof-backend
Some copy of STACK-OVERFLOW with REST API

API:

•Authentication module:
–POST - /api/auth/register- registration of a new user, required parameters are[login, password, password confirmation, email]
–POST - /api/auth/login - log in user, required parameters are [login, email,password]. Only users with a confirmed email can sign in
–POST - /api/auth/logout- log out authorized user
–POST - /api/auth/password-reset- send a reset link to user email, requiredparameter is [email]
–POST - /api/auth/password-reset/<confirm_token>- confirm new password with atoken from email, required parameter is a [new password]

•User module:
–GET - /api/users- get all users
–GET - /api/users/<user_id>- get specified user data
–POST - /api/users- create a new user, required parameters are [login, password,password confirmation, email, role]. This feature must be accessible only foradminsusof backend
–POST - /api/users/avatar- let an authorized user upload his/her avatar. Theuser will be designated by his/her access token–
PATCH - /api/users/<user_id>- update user data
–DELETE - /api/users/<user_id>- delete user

•Post module:
–GET - /api/posts- get all posts.This endpoint doesn't require any role, it ispublic. If there are too many posts, you must implement pagination. Page size isup to you
–GET - /api/posts/<post_id>- get specified post data.Endpoint is public
–GET - /api/posts/<post_id>/comments- get all comments for the specified post.Endpoint is public
–POST - /api/posts/<post_id>/comments- create a new comment, required parameteris [content]
–GET - /api/posts/<post_id>/categories- get all categories associated with thespecified post
–GET - /api/posts/<post_id>/like- get all likes under the specified post
–POST - /api/posts/- create a new post, required parameters are [title, content,categories]
–POST - /api/posts/<post_id>/like- create a new like under a post
–PATCH - /api/posts/<post_id>- update the specified post (its title, body orcategory). It's accessible only for the creator of the post–DELETE - /api/posts/<post_id>- delete a post–DELETE - /api/posts/<post_id>/like- delete a like under a post

•Categories module:
–GET - /api/categories- get all categories
–GET - /api/categories/<category_id>- get specified category data
–GET - /api/categories/<category_id>/posts- get all posts associated with thespecified category
–POST - /api/categories- create a new category, required parameter is [title]
–PATCH - /api/categories/<category_id>- update specified category data
–DELETE - /api/categories/<category_id>- delete a category•Comments module:
–GET - /api/comments/<comment_id>- get specified comment data
-GET - /api/comments/<comment_id>/like- get all likes under the specifiedcommentusof backend
–POST - /api/comments/<comment_id>/like- create a new like under a comment
–PATCH - /api/comments/<comment_id>- update specified comment data
–DELETE - /api/comments/<comment_id>- delete a comment
–DELETE - /api/comments/<comment_id>/like- delete a like under a comment



Make .env file with next parameters
JWT_SECRET= <your secret>
JWT_EXPIRE= <expiration for token>

page_size = <default amount of items on page>

mail_host = <>
mail_port = <>
mail_user = <>
mail_pass = <>
