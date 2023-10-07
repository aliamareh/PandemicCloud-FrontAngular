export interface VilleInfos{
  nom:string,
  population:number,
  maladieParDefaut:string,
  centreRecherche:string,
  cubesMaladie : Map<string,number>,
  villesAlentours:Array<string>,
  joueursDansLaVille:Array<string>
}
