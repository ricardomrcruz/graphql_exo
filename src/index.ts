import "reflect-metadata"; // add this
import { ApolloServer } from "@apollo/server";

import { startStandaloneServer } from "@apollo/server/standalone";
import {
  Arg,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  buildSchema,
} from "type-graphql";

@ObjectType()
class Book {
  @Field()
  id: string;
  @Field()
  title: string;
  @Field()
  author: string;
}

const books: Book[] = [
  {
    title: "The Awakening",
    author: "Kate Chopin",
    id: "1",
  },
  {
    title: "City of Glass",
    author: "Paul Auster",
    id: "2",
  },
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    id: "3",
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    id: "4",
  },
  {
    title: "1984",
    author: "George Orwell",
    id: "5",
  },
  {
    title: "Brave New World",
    author: "Aldous Huxley",
    id: "6",
  },
  {
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    id: "7",
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    id: "8",
  },
  {
    title: "Moby-Dick",
    author: "Herman Melville",
    id: "9",
  },
  {
    title: "The Brothers Karamazov",
    author: "Fyodor Dostoevsky",
    id: "10",
  },
];

@InputType()
class BookInput {
  @Field()
  title: string;

  @Field()
  author: string;
}

@Resolver(Book)
class BookResolver {
  @Query(() => [Book])
  books() {
    return books;
  }

  @Query(() => Book)
  getBookById(@Arg("id") id: string) {
    return books.find((book) => book.id == id);
  }

  @Mutation(() => Book)
  addBook(@Arg("data") { title, author }: BookInput) {
    const lastId = parseInt(books.at(-1).id, 10);
    const id = (lastId + 1).toString();
    books.push({ title, author, id });
    return books.at(-1);
  }
}

const schema = await buildSchema({
  resolvers: [BookResolver],
});

const server = new ApolloServer({ schema });

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);
