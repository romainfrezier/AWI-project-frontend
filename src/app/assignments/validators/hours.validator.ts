import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function hoursValidator(start: string, end: string): ValidatorFn {
  return (ctrl: AbstractControl): null | ValidationErrors => {
    if (!ctrl.get(start) || !ctrl.get(end)) {
      ctrl.setErrors({hoursValidator: 'Invalid control names'});
      return {hoursValidator: 'Invalid control names'}
    } else if (ctrl.get(start)!.value === ctrl.get(end)!.value) {
      ctrl.get(end)!.setErrors({hoursValidator: "L'heure de début doit être différente de l'heure de fin"});
      return {hoursValidator: 'Start and end must be different'}
    } else {

      let startHour = parseInt(ctrl.get(start)!.value.split('h')[0]);
      let startMinute = parseInt(ctrl.get(start)!.value.split('h')[1]) ? parseInt(ctrl.get(start)!.value.split('h')[1]) : 0;

      let endHour = parseInt(ctrl.get(end)!.value.split('h')[0]);
      let endMinute = parseInt(ctrl.get(end)!.value.split('h')[1]) ? parseInt(ctrl.get(end)!.value.split('h')[1]) : 0;

      if (startHour > endHour || (startHour === endHour && startMinute > endMinute)) {
        ctrl.get(end)!.setErrors({hoursValidator: "L'heure de début doit être avant l'heure de fin"});
        return {hoursValidator: 'Start must be before end'}
      } else {
        return null;
      }
    }
  };
}
