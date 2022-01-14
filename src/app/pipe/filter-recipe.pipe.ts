import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterRecipe',
})
export class FilterRecipePipe implements PipeTransform {

  transform(recipe: any, id: number): string {
    if (recipe != undefined && id != undefined) {
      recipe = recipe.filter((obj) => obj.id == id);
      return recipe[0];
    }
  }
}
