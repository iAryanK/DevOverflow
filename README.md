<div align="center">
  <br />
    <a href="https://dev-forces.vercel.app/" target="_blank">
      <img src="https://github.com/iAryanK/DevOverflow/blob/main/app/opengraph-image.png?raw=true" alt="Project Banner">
    </a>
  <br />

  <h3 align="center">Visit the website <a href="https://devforces.tech/" target="_blank"><b>DevForces</b></a> and start engaging in the community!</h3>
</div>

## 📋 <a name="table">Table of Contents</a>

1. 🤖 [Introduction](#introduction)
2. ⚙️ [Tech Stack](#tech-stack)
3. 🔋 [Features](#features)
4. 🤸 [Quick Start](#quick-start)
5. 🕸️ [Details](#details)

## <a name="introduction">🤖 Introduction</a>

DevForces, a Next.JS 14 Full Stack application, is a community driven platform that enables us to ask questions, get answered by others and answer other's questions as well. It also provides us the facility to write beautiful blog articles and post it on DevForces.

This peace of work is inspired from the application DevOverflow by javascriptmastery, who helped me create this mega project with highly detailed features.

## <a name="tech-stack">⚙️ Tech Stack</a>

- Next.JS 14
- Typescript
- MongoDB database
- Clerk Authentication
- Tailwind CSS , shadcn UI

## <a name="features">🔋 Features</a>

In addition to the features taught by adrianhajdin, I self implemented some of the following features - <br />
👉 **Blogs section**: The entire blogs section on devforces is purely a feature that I have implemented myself. Users can write and read blogs on devforces. They can upvote, downvote as well as comment on a blog.

👉 **Edit or delete blog**: User can edit as well as delete their own blogs by visiting their profile page.

👉 **Embed media in question or blogs**: DevForces also provides the facility to insert image/video in questions or blogs we post.

Apart from these, there are also some design and code changes that I have made to make it look more beautiful.

Other features implemented are as follows - <br />
👉 **Home page**: Enlists all questions that are asked by members of DevForces. Users can search or filter a question according to their choice.

👉 **Question Detail page**: Clicking on any specific question card on home page takes the user to the detailed view of that question where he/she can read the question and its answers.

👉 **Community page**: Shows list of all the members of DevForces. click on any user card to visit their profile.

👉 **Collections page**: Shows all the saved questions.

👉 **Tags page**: Contains all the tags that have been used on DevForces. Click on any tag to view its related questions.

👉 **Search posts by Specific Tag, username as well as content**: Allow users to search for posts based on their preference.

👉 **Profile page**: User can maintain their profile. They can also edit or delete their own posts from here. Users also get Badges according to their reputation count on DevForces.

👉 **Ask a question / write a blog page**: One can ask question and write their blogs by visiting these pages.

👉 **Theme Provider**: Users also have the facility to switch between light theme or dark theme.

The list continues as we explore this super responsive application, since there are highly detailed features which we can't even list down in this article.

## <a name="quick-start">🤸 Quick Start</a>

Follow these steps to set up the project locally on your machine.

**Prerequisites**

Make sure you have the following installed on your machine:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en)
- [npm](https://www.npmjs.com/) (Node Package Manager)

**Cloning the Repository**

```bash
git clone https://github.com/iAryanK/DevOverflow.git
cd DevOverflow
```

**Installation**

Install the project dependencies using npm:

```bash
npm install
```

**Set Up Environment Variables**

Create a new file named `.env.local` in the root of your project and add the following content:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

NEXT_CLERK_WEBHOOK_SECRET=

NEXT_PUBLIC_TINY_EDITOR_API_KEY=

MONGODB_URL=

NEXT_PUBLIC_SERVER_URL=
OPENAI_API_KEY=
```

Replace the placeholder values with your actual credentials. You can obtain these credentials by signing up on these corresponding websites from [Clerk](https://clerk.com/), [TinyMCE](https://www.tiny.cloud/), [MongoDB](https://www.mongodb.com/) and [OpenAI](https://openai.com/).

**Running the Project**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the project.

## <a name="details">🕸️ Details</a>

<details>
<summary><code>Why I preferred NEXT JS?</code></summary>

```
😀 simplifies development process
😀 optimizes web applications
😀 Server side and client side rendering
😀 Inbuilt Search Engine Optimization
😀 File and folder based routing
😀 FullStack application creating capability
😀 Automatic code splitting

And at the end of the day, it is just an extention of ReactJs.😀
```

</details>

<details>
<summary><code>Core Concepts implemented in DevForces</code></summary>

```
Following are the concepts of NextJS used in devforces-
➡️ File and Folder based routing
➡️ Client and server components
➡️ Routing and special NextJS files
➡️ Data fetching Strategies
➡️ NextJs Server Actions
➡️ Static and Dynamic Metadata

In addition to these, I used
➡️ Typescript
➡️ MongoDB, a non-relational database
➡️ zod validations
➡️ shadcn UI components
➡️ concept of webhooks

and so on...
```

</details>

<details>
<summary><code>Project DevForces development process</code></summary>

```
Starting from
npx create-next-app@latest

I set up a development environment on my VS Code by setting up tailwind CSS, shadcn, ESLint and prettier. I also connected by project folder to github repository so as to push my commits on it, regularly.

1️⃣ Authentication system is implemented using Clerk. Concept of webhooks comes into picture when we need to sync our clerk users to MongoDB database.
2️⃣ A global theme provider is created so as to switch between dark and light modes.
3️⃣ A basic structure of the website is created with a navigation bar, left sidebar and right sidebar.
4️⃣ Then routes of the following pages are created.
    - Home page
    - Ask a question page
    - Community page
    - Collections page
    - Tags page
    - Profile page
    - Blogs page and then write a blog page
5️⃣ Backend for various functionalities are created using server actions.
6️⃣ Various other features including pagination system & views count are also enabled.
7️⃣ User can also add media to their posts.
8️⃣ Finally, the app is deployed on [devforces.tech](https://devforces.tech/)

```

</details>

<br />

#
