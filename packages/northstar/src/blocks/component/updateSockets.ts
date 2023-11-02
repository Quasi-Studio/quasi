import {
  Direction,
  InSocket,
  MultiOutSocket,
  PATH_IN_ELIPSE,
  PATH_IN_RECT,
  PATH_OUT_ELIPSE,
  PATH_OUT_RECT,
  PATH_OUT_TRIANGLE,
} from "@quasi-dev/visual-flow";
import { ComponentBlock } from "./block";

export function updateSockets(block: ComponentBlock) {
  const { info } = block;

  const { contents, events, inputs, outputs } = info;

  block.updateSocket("parent", InSocket, Direction.LEFT, {
    type: "L",
    path: PATH_IN_RECT,
  });

  for (const content of contents) {
    if (content.kind === "as-primary") {
      block.removeSocket(content.name);
    } else {
      const socket = block.updateSocket(
        content.name,
        MultiOutSocket,
        content.position ?? Direction.RIGHT,
        {
          type: "L",
          path: PATH_OUT_RECT,
          disabled:
            content.kind === "as-primary-and-socket" && block.primaryFilled,
        },
      );

      if (content.kind === "as-primary-and-socket") {
        block.getPrimaryDisabled = () => {
          return socket.allConnectedLines.length > 0;
        };
      }
    }
  }

  for (const event of events) {
    block.updateSocket(
      event.name,
      MultiOutSocket,
      event.position ?? Direction.BOTTOM,
      {
        type: "E",
        path: PATH_OUT_TRIANGLE,
      },
    );
  }

  for (const input of inputs) {
    if (input.kind === "as-primary") {
      block.removeSocket(input.name);
    } else {
      const socket = block.updateSocket(
        input.name,
        InSocket,
        input.position ?? Direction.UP,
        {
          type: "D",
          path: PATH_IN_ELIPSE,
          disabled:
            input.kind === "as-primary-and-socket" && block.primaryFilled,
        },
      );

      if (input.kind === "as-primary-and-socket") {
        block.getPrimaryDisabled = () => {
          return socket.allConnectedLines.length > 0;
        };
      }
    }
  }

  for (const output of outputs) {
    block.updateSocket(
      output.name,
      MultiOutSocket,
      output.position ?? Direction.BOTTOM,
      {
        type: "D",
        path: PATH_OUT_ELIPSE,
      },
    );
  }
}
