<?php
$this->load_px_plugin_class('/contedit/bases/funcs.php');

/**
 * contedit markdown
 */
class pxplugin_contedit_funcs_markdown extends pxplugin_contedit_bases_funcs{

	/**
	 * 値をバインドする
	 */
	public function bind( $tpl_elm, $contElmData ){
		//  PHP Markdownライブラリをロード
		//  see: http://michelf.ca/projects/php-markdown/
		@require_once( $this->px->get_conf('paths.px_dir').'libs/PHPMarkdown/markdown.php' );

		$rtn = Markdown( $contElmData->src );

		return $rtn;
	}

}

?>