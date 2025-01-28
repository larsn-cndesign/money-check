import { TestBed } from '@angular/core/testing';
import { ErrorService } from './error.service';

describe('ErrorService', () => {
  let errorService: ErrorService;
  // let form: UntypedFormGroup;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    errorService = TestBed.inject(ErrorService);
  });

  it('should be created', () => {
    expect(errorService).toBeTruthy();
  });

  // it('returns error message if required validation fails', () => {
  //   const control = new UntypedFormControl('field', Validators.required);

  //   control?.setValue('');
  //   const errorMessage = errorService.getFormErrorMessage(control);

  //   expect(errorMessage).toBe('Du måste ange ett värde');
  // });

  // it('returns an empty string if control is null', () => {
  //   const errorMessage = errorService.getFormErrorMessage(null);

  //   expect(errorMessage).toBe('');
  // });

  // it('returns an empty string if control is valid', () => {
  //   const control = new UntypedFormControl('field', Validators.required);

  //   control?.setValue('123');
  //   const errorMessage = errorService.getFormErrorMessage(control);

  //   expect(errorMessage).toBe('');
  // });

  // it('returns error message if minlength validation fails', () => {
  //   const control = new UntypedFormControl('field', Validators.minLength(6));

  //   control?.setValue('12345');
  //   const errorMessage = errorService.getFormErrorMessage(control, 'Fält');

  //   expect(errorMessage).toBe('Fält måste vara minst 6 tecken');
  // });

  // it('returns error message if maxlength validation fails', () => {
  //   const control = new UntypedFormControl('field', Validators.maxLength(3));

  //   control?.setValue('1234');
  //   const errorMessage = errorService.getFormErrorMessage(control, 'Fält');

  //   expect(errorMessage).toBe('Fält får högste vara 3 tecken');
  // });

  // it('returns error message if duplicateOnEdit validation fails', () => {
  //   form = new UntypedFormGroup({
  //     items: new UntypedFormArray(
  //       [
  //         new UntypedFormGroup({
  //           key: new UntypedFormControl(0, [Validators.required]),
  //           value: new UntypedFormControl('Skatt', [Validators.required, Validators.maxLength(50)]),
  //         }),
  //         new UntypedFormGroup({
  //           key: new UntypedFormControl(1, [Validators.required]),
  //           value: new UntypedFormControl('Green fee', [Validators.required, Validators.maxLength(50)]),
  //         }),
  //         new UntypedFormGroup({
  //           key: new UntypedFormControl(2, [Validators.required]),
  //           value: new UntypedFormControl('El', [Validators.required, Validators.maxLength(50)]),
  //         }),
  //       ],
  //       // [duplicateOnEditValidator]
  //     ),
  //   });

  //   const items = form.get('items') as UntypedFormArray;
  //   items.controls[2].setValue({ key: -1, value: 'Skatt' });
  //   const errorMessage = errorService.getFormErrorMessage(items.controls[0].get('value'), 'kategori');
  //   items.controls[2].setValue({ key: -1, value: 'Vatten' });

  //   expect(errorMessage).toBe('Denna kategori finns redan');
  // });

  // it('returns error message if duplicateOnAdd validation fails', () => {
  //   form = new UntypedFormGroup(
  //     {
  //       item: new UntypedFormControl('Skatt', [Validators.required]),
  //       items: new UntypedFormArray(
  //         [
  //           new UntypedFormControl({ key: 0, value: 'Skatt' }),
  //           new UntypedFormControl({ key: 1, value: 'Green fee' }),
  //           new UntypedFormControl({ key: 2, value: 'El' }),
  //         ],
  //         // duplicateOnEditValidator
  //       ),
  //     },
  //     // { validators: [duplicateOnAddValidator('item', 'items')] }
  //   );

  //   const item = form.get('item');
  //   const errorMessage = errorService.getFormErrorMessage(item, 'kategori');

  //   expect(errorMessage).toBe('Denna kategori finns redan');
  // });

  // it('returns null if item name could not be found when validating duplicateOnAdd', () => {
  //   form = new UntypedFormGroup(
  //     { item: new UntypedFormControl('Skatt') },
  //     // { validators: [duplicateOnAddValidator('wrongNameHere', 'items')] } // <-- Wrong formcontrol name here
  //   );

  //   const item = form.get('item');
  //   const errorMessage = errorService.getFormErrorMessage(item, 'kategori');

  //   expect(errorMessage).toBe('');
  // });

  // it('should get error message on client error', () => {
  //   const mockError = new HttpErrorResponse({ error: 'Server error', status: 500 });

  //   const spy = spyOn(console, 'error');
  //   errorService
  //     .handleHttpError(mockError)
  //     .pipe(first())
  //     .subscribe(
  //       () => {},
  //       (error: any) => {
  //         expect(error).toContain('Something bad');
  //       }
  //     );

  //   expect(spy).toHaveBeenCalledWith(jasmine.stringMatching('^.*Backend.*$'));
  // });

  // it('should get error status on server error', () => {
  //   const errorEvent = new ErrorEvent('API Error', { message: 'client error' });
  //   const mockError = new HttpErrorResponse({ error: errorEvent, status: 400 });

  //   const spy = spyOn(console, 'error');
  //   errorService
  //     .handleHttpError(mockError)
  //     .pipe(first())
  //     .subscribe(
  //       () => {},
  //       (error: any) => {
  //         expect(error).toContain('Something bad');
  //       }
  //     );

  //   expect(spy).toHaveBeenCalledWith(jasmine.stringMatching('^.*occurred.*$'), 'client error');
  // });
});
