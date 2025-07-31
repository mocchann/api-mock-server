import Head from "next/head";
import { Geist, Geist_Mono } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useQuery } from "@apollo/client";
import { GET_USERS, GET_POSTS } from "@/graphql/queries";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const {
    data: usersData,
    loading: usersLoading,
    error: usersError,
  } = useQuery(GET_USERS);
  const {
    data: postsData,
    loading: postsLoading,
    error: postsError,
  } = useQuery(GET_POSTS);

  if (usersLoading || postsLoading) {
    return (
      <div
        className={`${styles.page} ${geistSans.variable} ${geistMono.variable}`}
      >
        <main className={styles.main}>
          <h1>データを読み込み中...</h1>
        </main>
      </div>
    );
  }

  if (usersError || postsError) {
    return (
      <div
        className={`${styles.page} ${geistSans.variable} ${geistMono.variable}`}
      >
        <main className={styles.main}>
          <h1>エラーが発生しました</h1>
          <p>モックサーバーが起動しているか確認してください。</p>
        </main>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>GraphQL Mock App</title>
        <meta name="description" content="GraphQL Mock Server with Next.js" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        className={`${styles.page} ${geistSans.variable} ${geistMono.variable}`}
      >
        <main className={styles.main}>
          <h1>GraphQL Mock App</h1>

          <div className={styles.section}>
            <h2>ユーザー一覧</h2>
            <div className={styles.grid}>
              {usersData?.users?.map((user: any) => (
                <div key={user.id} className={styles.card}>
                  <h3>{user.name}</h3>
                  <p>Email: {user.email}</p>
                  <p>投稿数: {user.posts?.length || 0}</p>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.section}>
            <h2>投稿一覧</h2>
            <div className={styles.grid}>
              {postsData?.posts?.map((post: any) => (
                <div key={post.id} className={styles.card}>
                  <h3>{post.title}</h3>
                  <p>{post.content}</p>
                  <p>著者: {post.author?.name}</p>
                  <p>
                    作成日:{" "}
                    {new Date(post.createdAt).toLocaleDateString("ja-JP")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
