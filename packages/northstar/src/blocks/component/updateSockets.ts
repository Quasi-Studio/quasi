import {
  Direction,
  MultiInSocket,
  MultiOutSocket,
  PATH_IN_ELIPSE,
  PATH_IN_RECT,
  PATH_IN_TRIANGLE,
  PATH_OUT_ELIPSE,
  PATH_OUT_RECT,
  PATH_OUT_TRIANGLE,
  SingleInSocket,
  SingleOutSocket,
} from "@quasi-dev/visual-flow";
import { ComponentBlock } from "./block";

export function updateSockets(block: ComponentBlock) {
  const { info } = block;

  const { contents, events, inputs, outputs, methods } = info;

  block.updateSocket("parent", SingleInSocket, Direction.LEFT, {
    type: "L",
    path: PATH_IN_RECT,
    hideLabel: true,
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
          hideLabel: contents.length === 1,
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
      SingleOutSocket,
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
        SingleInSocket,
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

  for (const method of methods) {
    block.updateSocket(
      method.name,
      MultiInSocket,
      method.position ?? Direction.TOP,
      {
        type: "E",
        path: PATH_IN_TRIANGLE,
      },
    );
  }
}
