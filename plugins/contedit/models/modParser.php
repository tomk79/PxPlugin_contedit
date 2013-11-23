<?php

/**
 * contedit modParser
 */
class pxplugin_contedit_models_modParser{

	/**
	 * コンストラクタ
	 */
	public function __construct(){
	}//__construct()

	public function parse( $bin , $input_type = null ){
		if( !strlen( $input_type ) ){
				// $input_type (入力の種類)を省略したら、自動的に判断する。
			if( @is_file( $bin ) ){
				$input_type = 'path';
			}else{
				$input_type = 'bin';
			}
		}
		if( $input_type == 'path' ){
			// 指定されたのがパスだったら開く
			$bin = @file_get_contents( $bin );
		}

		$rtn = array();

		while(1){
			if( !preg_match('/^(.*?)\{\$(.+?)\}(.*)$/s', $bin, $matched) ){
				array_push( $rtn, $this->create_text_node( $bin ) );
				break;
			}

			array_push( $rtn, $this->create_text_node( $matched[1] ) );
			array_push( $rtn, $this->create_template_node( $matched[2], $matched[3] ) );
			$bin = $matched[3];
			continue;
		}

		return $rtn;
	}

	/**
	 * テキストノードを作成する
	 */
	private function create_text_node($text){
		$rtn = array();
		$rtn['type']    = 'text';
		$rtn['content'] = $text;
		return $rtn;
	}// create_text_node()

	/**
	 * テンプレートノードを作成する
	 */
	private function create_template_node($src, $src_after){
		$rtn = array();
		$rtn['type']     = 'template';
		$rtn['content']  = $src;
		$rtn['children'] = array();// UTODO: 入れ子を想定して器だけつくった
		return $rtn;
	}// create_text_node()

}

?>