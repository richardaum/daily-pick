import { database } from './index';

export const importUsers = async () => {
  const users = [
    {
      id: '44rk24RbAwZByB9C92y4',
      name: 'Lucas Stoque',
      mention: '<@U02CFF8N10R>',
    },
    {
      id: '4IFpDX1JrhiBAM6cYLNR',
      name: 'Gustavo Toporowicz',
      mention: '<@U027EHPH708>',
    },
    {
      id: '6DpuDbNB3Sh2bX62OMKY',
      mention: '<@U02L0FFPLBX>',
      name: 'Pedro Medeiros',
    },
    {
      id: '7AQdAPlNugOLpR9rDwsL',
      name: 'Richard Lopes',
      mention: '<@U01D85X5P17>',
    },
    {
      id: 'BT7xP3XnWwuURaHCg02g',
      name: 'Laura Silva',
      mention: '<@U01HZ577A3C>',
    },
    {
      id: 'S9CRkq0aTs3dHnACga0h',
      mention: '<@U01S38UBYDV>',
      name: 'Erick Silva',
    },
    {
      id: 'br0CGPfPLVYQNhbUBnBA',
      mention: '<@U01QA5FLYKG>',
      name: 'Antonio Neto',
    },
    // {
    //   id: 'current',
    //   name: 'Richard Lopes',
    //   original_id: '7AQdAPlNugOLpR9rDwsL',
    //   mention: '<@U01D85X5P17>',
    // },
    {
      id: 'y8iCDxlk4hkMDYIBFlFz',
      mention: '<@U0286GXG10E>',
      name: 'Jean Livino',
    },
  ];

  users.forEach(async (user) => {
    await database
      .collection('teams')
      .doc('T02PFPNF6BF')
      .collection('channels')
      .doc('C02PKCMDH1R')
      .collection('users')
      .doc(user.id)
      .set({ name: user.name, mention: user.mention });
  });

  await database
    .collection('teams')
    .doc('T02PFPNF6BF')
    .collection('channels')
    .doc('C02PKCMDH1R')
    .update({
      order: [
        'br0CGPfPLVYQNhbUBnBA',
        'S9CRkq0aTs3dHnACga0h',
        '4IFpDX1JrhiBAM6cYLNR',
        'y8iCDxlk4hkMDYIBFlFz',
        'BT7xP3XnWwuURaHCg02g',
        '44rk24RbAwZByB9C92y4',
        '6DpuDbNB3Sh2bX62OMKY',
        '7AQdAPlNugOLpR9rDwsL',
      ],
    });
};
