import '@nomiclabs/hardhat-waffle';
import { HardhatUserConfig } from 'hardhat/types/config';
import { environment } from '../../../shared/src/lib/constants/environment';

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

export default {
  defaultNetwork: 'hardhat',
  solidity: {
    version: '0.8.3',
    compilers: [{ version: '0.8.3', settings: {} }],
  },
  paths: {
    artifacts: '../../../../apps/cryptosafe/src/app/artifacts',
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${environment.infura}`,

      // GET MORE FUNDS HERE: https://faucet.rinkeby.io/
      accounts: [environment.rinkeby],
    }
  }
} as HardhatUserConfig;
