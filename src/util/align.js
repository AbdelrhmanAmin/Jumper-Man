/*jshint esversion: 6 */
export class Align
{
	static scaleToGameW(obj,per,scene)
	{
		obj.displayWidth=scene.sys.game.config.width*per;
		obj.scaleY=obj.scaleX;
	}
	static centerH(obj,scene)
	{
		obj.x=scene.sys.game.config.width/2-obj.displayWidth/2;
	}
	static centerV(obj,scene)
	{
		obj.y=scene.sys.game.config.height/2-obj.displayHeight/2;
	}
	static center2(obj,scene)
	{
		obj.x=scene.sys.game.config.width/2-obj.displayWidth/2;
		obj.y=scene.sys.game.config.height/2-obj.displayHeight/2;
	}
	static center(obj,scene)
	{
		obj.x=scene.sys.game.config.width/2;
		obj.y=scene.sys.game.config.height/2;
	}
}
export default Align;