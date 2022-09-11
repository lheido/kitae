import Dockerode from "dockerode";
import type { Stream } from "stream";
import { getSessionByCookie } from "../../features/supabase";
import { buildJsonResponse } from "../../features/utils/api";

function _pullContainer(docker: Dockerode): Promise<void> {
  return new Promise((resolve, reject) => {
    docker.pull("hello-world", (e: any, stream: Stream) => {
      if (e) {
        reject(e);
      } else {
        docker.modem.followProgress(stream, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      }
    });
  });
}

export async function get({ request }: { request: Request }) {
  const response = buildJsonResponse();
  try {
    await getSessionByCookie(request, response);
  } catch (error) {
    return new Response(null, { status: 302, headers: { location: "/login" } });
  }

  try {
    const docker = new Dockerode();
    await _pullContainer(docker);
    const container = await docker.createContainer({
      Image: "hello-world",
      name: "fooo2",
    });
    await container.start();
    return response;
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify(error), { status: 500 });
  }
}
