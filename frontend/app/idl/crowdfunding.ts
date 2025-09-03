/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/crowdfunding.json`.
 */
export type Crowdfunding = {
  address: "Ept1VxEScf1bzfkwfEous1ZCDj16QCirBBq9kXzYAgwG";
  metadata: {
    name: "crowdfunding";
    version: "0.1.0";
    spec: "0.1.0";
    description: "Created with Anchor";
  };
  instructions: [
    {
      name: "claimFundByAuthor";
      discriminator: [84, 100, 15, 106, 65, 117, 188, 196];
      accounts: [
        {
          name: "creator";
          writable: true;
          signer: true;
          relations: ["campaign"];
        },
        {
          name: "campaign";
          writable: true;
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [];
    },
    {
      name: "closeCampaign";
      discriminator: [65, 49, 110, 7, 63, 238, 206, 77];
      accounts: [
        {
          name: "creator";
          writable: true;
          signer: true;
          relations: ["campaign"];
        },
        {
          name: "campaign";
          writable: true;
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [];
    },
    {
      name: "contributeAmount";
      discriminator: [174, 163, 90, 174, 63, 14, 253, 115];
      accounts: [
        {
          name: "contributor";
          writable: true;
          signer: true;
        },
        {
          name: "campaign";
          writable: true;
        },
        {
          name: "contribution";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [99, 111, 110, 116, 114, 105, 98, 117, 116, 111, 114];
              },
              {
                kind: "account";
                path: "campaign";
              },
              {
                kind: "account";
                path: "contributor";
              }
            ];
          };
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [
        {
          name: "amount";
          type: "u64";
        }
      ];
    },
    {
      name: "initCampaign";
      discriminator: [154, 188, 249, 244, 226, 210, 253, 109];
      accounts: [
        {
          name: "signer";
          writable: true;
          signer: true;
        },
        {
          name: "campaign";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [99, 97, 109, 112, 97, 105, 103, 110];
              },
              {
                kind: "account";
                path: "signer";
              },
              {
                kind: "arg";
                path: "title";
              }
            ];
          };
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [
        {
          name: "title";
          type: "string";
        },
        {
          name: "description";
          type: "string";
        },
        {
          name: "goal";
          type: "u64";
        },
        {
          name: "deadline";
          type: "i64";
        }
      ];
    },
    {
      name: "recontributeAmount";
      discriminator: [137, 81, 150, 136, 171, 46, 155, 38];
      accounts: [
        {
          name: "contributor";
          writable: true;
          signer: true;
          relations: ["contribution"];
        },
        {
          name: "campaign";
          writable: true;
          relations: ["contribution"];
        },
        {
          name: "contribution";
          writable: true;
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [
        {
          name: "amount";
          type: "u64";
        }
      ];
    },
    {
      name: "refundToContributor";
      discriminator: [46, 186, 139, 151, 249, 186, 63, 92];
      accounts: [
        {
          name: "contributor";
          writable: true;
          signer: true;
          relations: ["contribution"];
        },
        {
          name: "campaign";
          writable: true;
        },
        {
          name: "contribution";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [99, 111, 110, 116, 114, 105, 98, 117, 116, 111, 114];
              },
              {
                kind: "account";
                path: "campaign";
              },
              {
                kind: "account";
                path: "contributor";
              }
            ];
          };
        }
      ];
      args: [];
    }
  ];
  accounts: [
    {
      name: "campaign";
      discriminator: [50, 40, 49, 11, 157, 220, 229, 192];
    },
    {
      name: "contribution";
      discriminator: [182, 187, 14, 111, 72, 167, 242, 212];
    }
  ];
  errors: [
    {
      code: 6000;
      name: "deadlinePassed";
      msg: "The campaign deadline has already passed";
    },
    {
      code: 6001;
      name: "deadlineNotPassed";
      msg: "The campaign deadline has not yet passed";
    },
    {
      code: 6002;
      name: "deadlineShouldBeGreaterThanNow";
      msg: "Deadline should be greater than now!";
    },
    {
      code: 6003;
      name: "goalNotMet";
      msg: "The funding goal was not met";
    },
    {
      code: 6004;
      name: "goalMet";
      msg: "The funding goal was already met";
    },
    {
      code: 6005;
      name: "alreadyClaimed";
      msg: "Funds already claimed";
    },
    {
      code: 6006;
      name: "alreadyRefunded";
      msg: "Already refunded";
    },
    {
      code: 6007;
      name: "insufficientFunds";
      msg: "Contribution amount should be greater then 0";
    },
    {
      code: 6008;
      name: "unauthorizedOwner";
      msg: "Only owner can perform this operation";
    },
    {
      code: 6009;
      name: "underflow";
      msg: "underflow";
    },
    {
      code: 6010;
      name: "titleTooLong";
      msg: "Title too long";
    },
    {
      code: 6011;
      name: "descriptionTooLong";
      msg: "Description too long";
    },
    {
      code: 6012;
      name: "fundsAlreadyClaimed";
      msg: "Funds already claimed";
    }
  ];
  types: [
    {
      name: "campaign";
      type: {
        kind: "struct";
        fields: [
          {
            name: "creator";
            type: "pubkey";
          },
          {
            name: "title";
            type: "string";
          },
          {
            name: "description";
            type: "string";
          },
          {
            name: "goalAmount";
            type: "u64";
          },
          {
            name: "totalDonated";
            type: "u64";
          },
          {
            name: "deadline";
            type: "i64";
          },
          {
            name: "bump";
            type: "u8";
          },
          {
            name: "claimed";
            type: "bool";
          }
        ];
      };
    },
    {
      name: "contribution";
      type: {
        kind: "struct";
        fields: [
          {
            name: "campaign";
            type: "pubkey";
          },
          {
            name: "contributor";
            type: "pubkey";
          },
          {
            name: "totalAmountDonated";
            type: "u64";
          }
        ];
      };
    }
  ];
};
