export const welcome_text = (firstname: string | undefined) => `
👋 <b>Welcome ${firstname || ""}!</b>

Welcome to our chat bot!  
Here you can:
• <b>View or edit</b> your profile  
• <b>Find people</b> who share your interests or profession  
• <b>Connect</b> with specialists in your own field  
• <b>Start chatting</b> easily with others  

🔍 The <b>Search</b> feature uses the fields you filled in your profile to offer various smart search options — helping you discover users that truly match your goals.
`;

export const welcome_back_with_session_text = (firstname: string | undefined) => `
👋 <b>Welcome back, ${firstname || ""}!</b>

You have an active chat session right now. Please continue your conversation.
`;

export const welcome_back_text = (firstname: string | undefined) => `
👋 <b>Welcome back, ${firstname || ""}!</b>

Glad to see you again!  
Use the buttons below to explore the bot, view or edit your profile, search for other users, and continue your journey.
`;

export const inline_button_text = `
<b>🧑‍💼 Profile:</b>  
By clicking on <b>Profile</b>, you can view your contact list, check your block list, and edit your personal information.

<b>🔍 Search:</b>  
Use the <b>Search</b> feature to find other users based on the fields you’ve filled in your profile.
`;

export const keyboard_description_text = `
⌨️ To navigate the bot easily, you can use the keyboard at the bottom of the chat.  

With this keyboard, you can quickly:  
• View or edit your profile  
• Search for other users  
• Access different sections of the bot  

Just tap the buttons and enjoy all the features!`;
