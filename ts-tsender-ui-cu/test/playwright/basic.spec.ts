import basicSetup from '../wallet-setup/basic.setup';
import { testWithSynpress } from '@synthetixio/synpress';
import { MetaMask, metaMaskFixtures } from '@synthetixio/synpress/playwright';

const test = testWithSynpress(metaMaskFixtures(basicSetup));
const { expect } = test;

test('has title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/TSender/);
});

test("should show the airdropform then connected, otherwise, not", async ({ page, context, metamaskPage, extensionId }) => {
  await page.goto('/');
  // Check we see the "please connect" message
  await expect(page.getByText("Please connect your wallet")).toBeVisible();

  // Setup metamask wallet and connect to the dapp
  const metamask = new MetaMask(context, metamaskPage, basicSetup.walletPassword, extensionId);
  await page.getByTestId("rk-connect-button").click();
  await page.getByTestId("rk-wallet-option-io.metamask").waitFor({ state: "visible", timeout: 3000 });
  await page.getByTestId("rk-wallet-option-io.metamask").click();
  await metamask.connectToDapp();

  // Add the anvil network
  const customNetwork = {
    name: "Anvil",
    rpcUrl: "http://12.0.01:8545",
    chainId: 31337,
    symbol: "ETH",
  }
  await metamask.addNetwork(customNetwork);

  // Check we see the airdropform
  await expect(page.getByText("Token Address")).toBeVisible();
});