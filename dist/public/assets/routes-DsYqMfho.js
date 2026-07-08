import { z } from "./index-DwfS90rP.js";
import { a as insertCredentialSchema, i as insertProductSchema } from "./schema-LvteV3nW.js";
({
  validation: z.object({
    message: z.string(),
    field: z.string().optional()
  }),
  notFound: z.object({
    message: z.string()
  }),
  internal: z.object({
    message: z.string()
  })
});
const api = {
  products: {
    list: {
      path: "/api/products",
      responses: {
        200: z.array(z.custom())
      }
    },
    create: {
      path: "/api/products",
      responses: {
        201: z.custom()
      }
    },
    update: {
      path: "/api/products/:id",
      input: insertProductSchema.partial(),
      responses: {
        200: z.custom()
      }
    },
    delete: {
      path: "/api/products/:id",
      responses: {
        204: z.void()
      }
    }
  },
  orders: {
    list: {
      path: "/api/orders",
      responses: {
        200: z.array(z.custom())
      }
    }
  },
  credentials: {
    list: {
      responses: {
        200: z.array(z.custom())
      }
    },
    create: {
      path: "/api/credentials",
      responses: {
        201: z.custom()
      }
    },
    delete: {
      path: "/api/credentials/:id",
      responses: {
        204: z.void()
      }
    },
    update: {
      path: "/api/credentials/:id",
      input: insertCredentialSchema.partial(),
      responses: {
        200: z.custom()
      }
    }
  },
  stats: {
    get: {
      path: "/api/stats",
      responses: {
        200: z.object({
          totalSales: z.number(),
          dailySales: z.number(),
          totalRevenue: z.number(),
          dailyRevenue: z.number(),
          availableProducts: z.number()
        })
      }
    }
  },
  settings: {
    get: {
      responses: {
        200: z.object({ key: z.string(), value: z.string() }).optional()
      }
    },
    update: {
      input: z.object({ key: z.string(), value: z.string() }),
      responses: {
        200: z.object({ key: z.string(), value: z.string() })
      }
    }
  },
  telegramUsers: {
    list: {
      responses: {
        200: z.array(z.custom())
      }
    },
    update: {
      input: z.object({ balance: z.number().optional(), purchased: z.number().optional() }),
      responses: {
        200: z.custom()
      }
    }
  },
  payments: {
    list: {
      responses: {
        200: z.array(z.custom())
      }
    }
  },
  broadcast: {
    channels: {
      list: {
        path: "/api/broadcast/channels",
        responses: {
          200: z.array(z.custom())
        }
      },
      create: {
        path: "/api/broadcast/channels",
        input: z.object({ channelId: z.string(), name: z.string() }),
        responses: {
          201: z.custom()
        }
      },
      delete: {
        path: "/api/broadcast/channels/:id",
        responses: {
          204: z.void()
        }
      }
    },
    send: {
      path: "/api/broadcast/send",
      input: z.object({
        message: z.string(),
        imageUrl: z.string().optional(),
        buttonText: z.string().optional(),
        buttonUrl: z.string().optional(),
        channelIds: z.array(z.string()).optional()
      }),
      responses: {
        200: z.object({ success: z.boolean(), count: z.number() })
      }
    },
    messages: {
      list: {
        path: "/api/broadcast/messages",
        responses: {
          200: z.array(z.custom())
        }
      },
      create: {
        path: "/api/broadcast/messages",
        input: z.object({
          content: z.string(),
          imageUrl: z.string().optional().nullable(),
          buttonText: z.string().optional().nullable(),
          buttonUrl: z.string().optional().nullable(),
          interval: z.number().nullable()
        }),
        responses: {
          201: z.custom()
        }
      },
      update: {
        path: "/api/broadcast/messages/:id",
        input: z.object({
          content: z.string().optional(),
          imageUrl: z.string().optional().nullable(),
          buttonText: z.string().optional().nullable(),
          buttonUrl: z.string().optional().nullable(),
          interval: z.number().nullable().optional(),
          status: z.string().optional(),
          sentCount: z.number().optional()
        }),
        responses: {
          200: z.custom()
        }
      },
      delete: {
        path: "/api/broadcast/messages/:id",
        responses: {
          204: z.void()
        }
      }
    }
  }
};
function buildUrl(path, params) {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
export {
  api as a,
  buildUrl as b
};
