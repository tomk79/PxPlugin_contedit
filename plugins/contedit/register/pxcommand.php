<?php
$this->load_px_class('/bases/pxcommand.php');

/**
 * PX Plugin "contedit"
 */
class pxplugin_contedit_register_pxcommand extends px_bases_pxcommand{

	private $command;
	private $plugin_obj;

	/**
	 * コンストラクタ
	 * @param $command = PXコマンド配列
	 * @param $px = PxFWコアオブジェクト
	 */
	public function __construct( $command , $px ){
		parent::__construct( $command , $px );
		$this->command = $this->get_command();
		$this->plugin_obj = $this->px->get_plugin_object( 'contedit' );

		print $this->html_template( $this->start() );
		exit;
	}


	/**
	 * コンテンツ内へのリンク先を調整する。
	 */
	private function href( $linkto = null ){
		return $this->plugin_obj->href( $linkto );
	}

	/**
	 * コンテンツ内へのリンクを生成する。
	 */
	private function mk_link( $linkto , $options = array() ){
		return $this->plugin_obj->mk_link( $linkto , $options );
	}

	// ------------------------------------------------------------------------------------------------------------------

	/**
	 * 処理の開始
	 */
	private function start(){
		if( $this->command[2] == 'property' ){
			return $this->page_theme_property();
		}elseif( $this->command[2] == 'edit' ){
			return $this->page_edit_theme();
		}
		return $this->page_homepage();
	}

	/**
	 * ホームページを表示する。
	 */
	private function page_homepage(){

		$src = '';
		$src .= '<p>テーマを編集するプラグインです。</p>'."\n";
		$src .= ''."\n";

		$current_theme_id = $this->px->theme()->get_theme_id();

		$path_theme_dir = $this->px->get_conf('paths.px_dir').'themes/';
		$theme_id_list = $this->px->dbh()->ls( $this->px->get_conf('paths.px_dir').'themes' );
		foreach( $theme_id_list as $key=>$val ){
			if( !is_dir( $path_theme_dir.$val ) ){ unset( $theme_id_list[$key] ); }//ディレクトリじゃない場合は除外
			if( preg_match( '/^\./', $val ) ){ unset( $theme_id_list[$key] ); }//ドットで始まる場合は除外
		}

		if( !count($theme_id_list) ){
			$src .= '<p>テーマは登録されていません。</p>'."\n";
		}else{
			$src .= '<div class="unit">'."\n";
			$src .= '<table class="def" style="width:100%;">'."\n";
			$src .= '	<thead>'."\n";
			$src .= '		<tr>'."\n";
			$src .= '			<th>テーマID</th>'."\n";
			$src .= '			<th>テーマが定義しているアウトライン名</th>'."\n";
			$src .= '			<th>---</th>'."\n";
			$src .= '			<th>---</th>'."\n";
			$src .= '			<th>---</th>'."\n";
			$src .= '		</tr>'."\n";
			$src .= '	</thead>'."\n";
			foreach( $theme_id_list as $theme_id ){
				$src .= '	<tr>'."\n";
				$src .= '		<th style="word-break:break-all;"><span'.($current_theme_id==$theme_id?' class="current"':'').'>'.t::h($theme_id).'</span></th>'."\n";
				$src .= '		<td style="word-break:break-all;">'."\n";
				$outline_list = $this->px->dbh()->ls( $this->px->get_conf('paths.px_dir').'themes/'.$theme_id.'/' );
				foreach( $outline_list as $number=>$filename ){
					if( $this->px->dbh()->get_extension($filename) != 'html' ){
						unset($outline_list[$number]);
					}else{
						$outline_list[$number] = $this->px->dbh()->trim_extension( $outline_list[$number] );
					}
				}
				if( !count($outline_list) ){
					$src .= '		<div class="center">---</div>'."\n";
				}else{
					$src .= '		<div>'.implode(', ', $outline_list).'</div>'."\n";
				}
				$src .= '		</td>'."\n";
				$src .= '		<td class="center">'.($current_theme_id==$theme_id?'適用中':'<a href="?THEME='.t::h($theme_id).'">適用する</a>').'</td>'."\n";
				$src .= '		<td class="center"><a href="'.t::h( $this->href( ':property.'.$theme_id ) ).'">詳細を見る</a></td>'."\n";
				$src .= '		<td class="center"><a href="'.t::h( $this->href( ':edit.'.$theme_id.'.default' ) ).'">編集する</a></td>'."\n";
				$src .= '	</tr>'."\n";
			}
			$src .= '</table>'."\n";
			$src .= '</div>'."\n";
		}

		return $src;
	}

	/**
	 * テーマの詳細画面する。
	 */
	private function page_theme_property(){
		$theme_obj = $this->plugin_obj->factory_model_theme( $this->command[3] );
		if( !strlen( $theme_obj->get_theme_id() ) ){
			return '<p>テーマIDを指定してください。</p>';
		}
		if( !$theme_obj->is_theme_exists() ){
			return '<p>テーマ『'.t::h( $theme_obj->get_theme_id() ).'』は未定義です。</p>';
		}


		$this->set_title('テーマ『'.$theme_obj->get_theme_id().'』');
		$src = '';
		$src .= '<div class="unit">'."\n";
		$src .= '<table class="def" style="width:100%;">'."\n";
		$src .= '	<tr>'."\n";
		$src .= '		<th style="width:30%;">テーマID</th>'."\n";
		$src .= '		<td style="width:70%;">'.t::h( $theme_obj->get_theme_id() ).'</td>'."\n";
		$src .= '	</tr>'."\n";
		$src .= '	<tr>'."\n";
		$src .= '		<th style="width:30%;">レイアウトID</th>'."\n";
		$src .= '		<td style="width:70%;">'."\n";
		$layouts = $theme_obj->get_layout_list();
		foreach( $layouts as $layout_id ){
			$src .= '		'.t::h( $layout_id ).' <a href="'.t::h( $this->href(':edit.'.$theme_obj->get_theme_id().'.'.$layout_id) ).'">編集する</a><br />'."\n";
		}
		$src .= '		</td>'."\n";
		$src .= '	</tr>'."\n";
		$src .= '</table>'."\n";
		$src .= '</div>'."\n";
		$src .= '<form action="?" method="get">'."\n";
		$src .= '	<p class="center"><input type="submit" value="defaultのレイアウトを編集する" /></p>'."\n";
		$src .= '	<div><input type="hidden" name="PX" value="'.t::h( $this->command[0].'.'.$this->command[1].'.edit.'.$theme_obj->get_theme_id().'.default' ).'" /></div>'."\n";
		$src .= '</form>'."\n";
		return $src;
	}


	/**
	 * テーマを編集する。
	 */
	private function page_edit_theme(){
		$theme_obj = $this->plugin_obj->factory_model_theme( $this->command[3] );
		if( !strlen( $theme_obj->get_theme_id() ) ){
			return '<p>テーマIDを指定してください。</p>';
		}
		if( !$theme_obj->is_theme_exists() ){
			return '<p>テーマ『'.t::h( $theme_obj->get_theme_id() ).'』は未定義です。</p>';
		}

		$layout_obj = $theme_obj->factory_model_layout( $this->command[4] );
		if( !strlen( $layout_obj->get_layout_id() ) ){
			return '<p>レイアウトIDが指定されていません。</p>';
		}

		// ↓訳あって、編集対象のテーマを選択しなければならない。
		$this->px->theme()->set_theme_id( $theme_obj->get_theme_id() );

		// ↓編集画面を起動する。
		$obj = $this->plugin_obj->factory_editor( $theme_obj, $layout_obj );
		return $obj->execute();
	}

}

?>
