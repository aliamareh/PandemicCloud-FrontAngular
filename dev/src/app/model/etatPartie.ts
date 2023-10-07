import {Carte} from "./carte";

export interface EtatPartie {
  idPartie: number
  nbJoueurs:number
  joueurs:Map<string,string>
  jc:string
  etat:number
  nvPropagation:number
  eclosion:number
  centreRecherche:Array<string>
  gueri:Array<string>
  eradique:Array<string>
  cubesMaladie:Map<string,string>
  defausseJoueur:Array<Carte>
  defaussePropagation:Array<Carte>
}
