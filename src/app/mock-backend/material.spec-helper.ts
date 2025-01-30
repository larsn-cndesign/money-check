import { MatSelectHarness } from '@angular/material/select/testing';
import { HarnessLoader } from '@angular/cdk/testing';

/**
 * Helper function to select an option from a mat-select based on the data-testid attribute.
 * @param loader The HarnessLoader instance
 * @param testId The data-testid value of the mat-select
 * @param optionIndex The index of the option to select
 */
export async function selectMatOption(loader: HarnessLoader, testId: string, optionIndex: number): Promise<void> {
  // Get the mat-select harness based on the provided data-testid
  const matSelect = await loader.getHarness(MatSelectHarness.with({ selector: `[data-testid="${testId}"]` }));

  // Open the mat-select dropdown
  await matSelect.open();

  // Get the options from the dropdown
  const options = await matSelect.getOptions();

  // Check if the index is valid, otherwise throw an error
  if (options.length <= optionIndex) {
    throw new Error(`Option index ${optionIndex} out of bounds for mat-select with testId ${testId}`);
  }

  // Click the desired option
  await options[optionIndex].click();
}
