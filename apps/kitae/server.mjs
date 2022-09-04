import express from "express";
import cookieParser from "cookie-parser";
import { handler as ssrHandler } from "./dist/server/entry.mjs";

const app = express();
app.use(express.static("dist/client/"));
app.use(express.json());
app.use(cookieParser());
app.use(ssrHandler);

app.listen(3000);
